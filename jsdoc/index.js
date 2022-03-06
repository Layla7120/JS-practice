/**
 * 로딩 할 때 나오는 화면 조절
 * @function showLoadingScreen
 * @returns {function}
 */
const showLoadingScreen = function () {
  const $loading = document.querySelector('#loading')
  return () => {
    const classes = $loading.classList
    classes.contains('invisible') 
      ? classes.remove('invisible') 
      : classes.add('invisible')
  }
}
/** 
 * google.script.run promisify 
 * serverFunction 을 찾아서 args를 넣은 html을 띄워준다. 
 * @function asyncRun
 * @param { serverFunction:string, args :string[] } serverFunction을 args를 넣어 실행시켜준다. 
 * @returns {Promise} Promise
 */
const asyncRun = function ({ serverFunction = '', args = [] } = {}) {
  const changeLoadingView = showLoadingScreen()
  changeLoadingView()
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(result => {
        changeLoadingView()
        resolve(result)
      })
      .withFailureHandler(err => reject(err))
      [serverFunction](...args)
  })
}

/** 
 * Utility function pipe 함수를 이어줌
 * @function pipe 
 * @param {...function}
 */
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x)

/** 
 * 사용자코드, 사용자 이름을 불러옴 
 * @function getUserInfoFromCaption
 * @returns {userCode : string, userName : string}
 */
const getUserInfoFromCaption = function () {
  const captionEl = document.getElementById('user-info')
  const [userCode, userName] = captionEl.textContent.split(/\s+/)
  return { userCode, userName }
}

/**@type {object} */
let studentBasicInfo, scheduleData
// main elements
/**@type {element} */
const app = document.querySelector('#app')
const search = document.querySelector('#search-link')
const addStudent = document.querySelector('#add-student-link')

/**
 * 학생들의 기본정보를 
 * serverFunction 'getStudentBasicInfo' 도움을 받아 
 * studentBasicInfo(global) 모아두는 함수
 * @function getStudentsBasicInfo
 * */
 
const getStudentsBasicInfo = 
  asyncRun({ serverFunction:'getStudentBasicInfo' })
    .then(basicInfo => {
      // console.log(basicInfo)
      studentBasicInfo = basicInfo
    })
    .catch(err => console.error(err))

/** 
 * 학습 스케줄 작성 화면 띄우기 
 * 1. studySchedule.html 로드
 * 2. getStudentSchedule 함수로부터 스케줄 정보 받아오기
 * 3. displaySchedule 함수에 스케줄 정보 넣음
 * 4. displaySchedule 함수에서 받은 정보를 html에 각각 입력
 * @function loadStudyScheduleView    
 * @param {event} e
 * */
const loadStudyScheduleView = function (e) {
  const userName = e.target.dataset.userName
  const userCode = e.target.dataset.userCode
  asyncRun({
    serverFunction: 'loadView',
    args: [{ fileName: 'studySchedule'}]
  })
  .then(html => app.innerHTML = html)
  .then(() => asyncRun({
    serverFunction: 'getStudentSchedule',
    args: [{ userName, userCode }]
  }))
  .then(schedules => {
    scheduleData = schedules
    //console.log(scheduleData)
    return schedules.map(scheduleInfo => displaySchedule(scheduleInfo))    
  })
  .then(elements => elements.forEach(
    element => 
      attachNodeOn(document.getElementById('schedule-results'))(
        element
      )))
  .then(() => {
    const captionEl = document.getElementById('user-info')
    captionEl.textContent = `${userCode} ${userName}`
  }) 
}

/**
 * 학생 찾는 화면 
 * 1. search.html 로드
 * 2. index.html 'app' 에 html 작성
 * @function loadSearchView
 *  */ 
const loadSearchView = function () {
  asyncRun({ 
    serverFunction: 'loadView', 
    args: [{ fileName: 'search' }]}
  )
  .then(html => app.innerHTML = html)
  .catch(err => console.error(err))
}

/**
 * 새로운 학생 입력하기 
 * 1. addStudent.html 로드
 * 2. index.html 'app' 에 html 작성
 * @function loadAddStudentView
 *  */ 
const loadAddStudentView = function () {
  asyncRun({
    serverFunction: 'loadView', 
    args: [{ fileName: 'addStudent' }]}
  )
  .then(html => app.innerHTML = html)
  .catch(err => console.error(err))
}

/**
 * userName과 userCode를 serverFunction: 'initializeStudent' 에 넘겨
 * 신규 사용자 등록한다.
 * @function initializeStudent
 *  */ 
const initializeStudent = function () {
  const userCodeEl = document.querySelector('#userCode')
  const userNameEl = document.querySelector('#userName')
  asyncRun({ serverFunction: 'initializeStudent', 
    args : [
      { userName: userNameEl.value.trim(), 
      userCode: userCodeEl.value.trim() }] })
    .then(() => {
      userCodeEl.value = ''
      userNameEl.value = ''
    })
    .catch(err => console.error(err))
}

/**
 * serarch 기능
 * 입력정보 받아와서 빈칸 기준으로 분리해서 리턴
 * @function studentInput
 * @param {event} event 
 * @returns {string} inputValues 
 */
const studentInput = function (event) {
  const inputValue = event.target.value
  return inputValue.split(/\s+/)        
}

/**
 * studentbasicInfo(global)에 inputValues가 있는 지 조사
 * Object.values() : 전달된 파라미터 객체가 가지는 속성의 값들로 이루어진 배열을 리턴
 * Array.prototype.some() : 배열 안의 어떤 요소라도 주어진 판별 함수를 통과하는지 테스트함 
 * @function findValueFrom
 * @param {Array.<string>} inputValues 
 * @returns {Array.<string>} filtered
 */
const findValueFrom = function (inputValues = []) {
  //console.log(inputValues)
  const filtered = studentBasicInfo.filter(info => 
      inputValues.every(
        value => {
          if (value) 
          return Object.values(info).some(
            userInfo => userInfo.match(value)
            )
        }
      )
  )
  //console.log(filtered)
  return filtered
}

/**
 * filtered 된 항목을 화면에 표시
 * @function display 
 * @param {Array.<String>} studentInfos 
 * @return {element} tr
 */
const display = function (studentInfos) {
  // row를 만들어서 리턴
  const makeRow = function ({ userName, userCode } = {}) {
    const templateBox = document.querySelector("#searchTemplate")
    const tr = templateBox.cloneNode(true).content
    //console.log(tr)  
    tr.querySelector('.userName').textContent = userName
    tr.querySelector('.userCode').textContent = userCode
    // write-schedule버튼에 user-code, user-name attr 달기
    tr.querySelector('.write-schedule').dataset.userCode = userCode
    tr.querySelector('.write-schedule').dataset.userName = userName
    //console.log(tr)
    return tr
  }
  const searchResults = document.querySelector("#search-results")
  searchResults.innerHTML = ''
  if(studentInfos) {
    studentInfos.map(info => makeRow(info))
    .forEach(tr => {
    //console.log(tr)
    searchResults.appendChild(tr)
  })
  }         
}

/**
 * 함수를 합쳐서 입력 결과에 맞는 학생 찾기
 * {@link studentInput}
 * {@link findValueFrom}
 * {@link display}
 * @function searchStudent */
const searchStudent = pipe(
  studentInput,
  findValueFrom,
  display
)

/**************************************
* 학생의 스케줄 정보불러 와서 화면에 표시하기
***************************************/
/**
 * 템플릿 가져오기
<<<<<<< HEAD
 * @function templateOn
 * @param {element} templateId 
 * @returns {element} cloneNode
 */
const templateOn = function (templateId) {
  const templateBox = document.querySelector(templateId)
  return templateBox.content.cloneNode(true).children[0]
}

// 주어진 엘리먼트에 속하는 엘리먼트에 원하는 엘리먼트에 정보달아서 리턴
/**
<<<<<<< HEAD
 * 주어진 엘리먼트에 속하는 엘리먼트에 원하는 엘리먼트에 정보달아서 리턴
=======
>>>>>>> 7edf2a5a0059979eacdf4dcfc6da257a1bc0b8cb
 * 클래스 만들기
 * @class EquipElement
 */
class EquipElement {
  constructor (element) {
    this.element = element
  }

  /**
   * tag에 따른 html-elements 뽑기
   * @function elementsByTag
   * @param {element} tagName 
   * @returns {element} this.element.getElementsByTagName(tagName)
   */
  elementsByTag (tagName) {
    return this.element.getElementsByTagName(tagName)
  }
  /**
   * @function makeTextExtractor
   * @param {element} elements 
   * @returns {string[]} result Schedule에서 해당하는 text 추출해 result에 push
   */
  makeTextExtractor (elements) {
    let result = []
    for(let element of elements) {
      result.push(schedule => element.textContent = schedule[element.className])
    }
    return result
  }
  /**
   * @function extractText
   * @param {element} tagName 
   * @returns {Array.<String>} (schedule) => {
   *  textExtractors.forEach(extractor => extractor(schedule))
   * }  
   * @todo see it again
   */
  extractText (tagName) {
    const textExtractors = pipe(
      this.elementsByTag.bind(this),
      this.makeTextExtractor
    ) (tagName)
    return (schedule) => {
      textExtractors.forEach(extractor => extractor(schedule))
    } 
  }

  // 갯수와 종류 입력해서 element 만들어서 붙이고 클래스 네임 달기
  /**
   * @fucntion makeElements
   * @param {*} param0 
   * @returns 
   */
  makeElements ({numbers = 0, nodeTag = '', className = ''} = {}) {
    const elements = []
    for (let i = 0; i < numbers; i++) {
      let node = document.createElement(nodeTag)
      if(className) {
        className.split(' ').forEach(name => node.classList.add(name))
      }
      elements.push(node)
    }
    if(elements.length <= 1) return elements[0]
    return elements
  }
  // 동질적인 자료의 배열을 입력받아 element 원하는 방식으로 표시하기
  setElementsFromArray ({ items = [], nodeTag = '', className } = {}) {
    items = items.filter(([_, status]) => status)
    const args = {
      numbers: items.length,
      nodeTag,
      className
    }
    //console.log(args)
    return (afterAction) => {
      //console.log(args)
      const elements = this.makeElements(args)
      //console.log(elements)
      elements.map((element, idx) => {
        const inputNodes = this.makeElements(
          { 
            numbers: items[idx].length, 
            nodeTag: 'input', 
            className: 'form-inline form-control form-control-sm track-data'
          }
        )
        items[idx].map((content, i) => {
          const node = inputNodes[i]
          node.setAttribute("readonly", true)
          node.value = content
          node.type = 'text'
          if(i == 1) node.classList.add('track-status')
          return node
        })
        .forEach(node => element.appendChild(node))
        //console.log(element)
        return element
      })
      .forEach(element => this.element.appendChild(element))
      if(afterAction) afterAction(this.element)
    }
  }
  // 체크 박스 만들기
  makeCheckBox() {
    const checkHolder = this.makeElements(
      { numbers: 1, nodeTag:'td', className: 'check-holder' }
    )
    const checkBox = this.makeElements(
      { numbers: 1,  nodeTag: 'input', className: 'form-check-input edit-schedule' }
    )
    checkBox.type = "checkbox"
    checkBox.value = ""
    checkHolder.append(checkBox)
    return checkHolder
  }        
}


// 객체를 이용해서 td element에 텍스트 다는 함수 만들기
const modifyElement = function (element) {
  const elementSetter = new EquipElement(element)
  
  return scheduleInfo => {
    elementSetter.extractText('td')(scheduleInfo)
    const { schedule } = scheduleInfo
    const setTracks = elementSetter.setElementsFromArray(
      { items: schedule, nodeTag: 'td', className: 'track' }
    )
    const checkHolder = elementSetter.makeCheckBox()
    setTracks(element => element.prepend(checkHolder))
    //console.log(elementSetter.element)
    return element
  }    
}

/**
 * [DOM] html 원하는 곳에 append하기
 * @function attachNodeOn
 * @param {Element} node 
 * @return {function} element => node.appendChild(element)  : 이게 콜백인가? 
 *  */ 
const attachNodeOn = function (node) {
  return element => node.appendChild(element)
} 


/**
 * scheduleInfo 에 있는 데이타를 tr에 반영해서 보여줌
 * @function displaySchedule
 * @param {object} scheduleInfo
 *  */ 
const displaySchedule = function (scheduleInfo = {}) {
  const extractor = pipe(
    templateOn,
    modifyElement
  )("#schedule-template")
  return extractor(scheduleInfo)
}

// checkbox check 되어 있을 때 readonly -> false로 
const changeScheduleReadOnly = function (e) {
  const parentRow = e.target.closest(".schedule-row")
  const trackElements = parentRow.getElementsByClassName('track-data')
  const statusElements = parentRow.getElementsByClassName('track-status')
  
  const checkBox = parentRow.querySelector(".edit-schedule")
  if (checkBox.checked) {
    for (let box of statusElements) {
      box.setAttribute('list', 'status-list')
    }
    for (let box of trackElements) {
      box.readOnly = false
    }

  } else {
    // 이전 데이타 복원 작업, schedule.round는 숫자인거 조심할 것
    const round = parentRow.querySelector('.round').textContent
    const schedule = scheduleData.filter(
      schedule => schedule.round.toString() === round)[0] // 필터의 결과는 array
    //console.log(round, schedule)
    const previous = displaySchedule(schedule).querySelectorAll('.track-data')
    
    for (let [idx, previousTrack] of previous.entries())  {
      let parentNode = trackElements[idx].parentNode
      parentNode.replaceChild(previousTrack, trackElements[idx])
    }    
  }
}

/*****************************
 * 스케줄 매니저를 이용하는 함수들
 * ***************************/
// 활성화 시키는 함수
const activate = async function () {
  // user-info
  const scheduleManager = pipe(
    getUserInfoFromCaption,
    userInfo => new ScheduleManager(userInfo)          
  ) ()
  const checked = scheduleManager.getCheckedBoxes()        
  if(checked.length > 1 || checked.length == 0) {
    const alert = makeAlert('danger')
    alert('하나의 체크 박스만 체크해 주세요')
  } else {
  const round = scheduleManager.getRoundsOfChecked()[0]
  await scheduleManager.activate(round)
  }  
}
// 신규 스케줄 업데이트 하는 함수
const addNewSchedule = async function () {
  const userInfo = getUserInfoFromCaption()
  const sm = new ScheduleManager(userInfo)
  const generatedSchedule = await sm.makeBasicSchedule()
  sm.scheduleToNode(generatedSchedule)
  await sm.loadSchedules()
  sm.syncSchedules()
  clearAddSchedule()        
}
// 성적 매니저
class ScoreManager {
  constructor(userInfo = {}) {
    this.scores = []
    this.userInfo = userInfo
  }
  // 학생 성적 데이타 받는 함수
  // async loadScores () {}
}


// 파일을 서버에 보내서 등록하기
const clearDriveInput = function () {
  const $driveFileInput = document.querySelector('#drive-upload')
  $driveFileInput.value =  ''
}
const sendFilesToGoogleDrive = async function () {
  const userInfo = getUserInfoFromCaption()
  const scheduleManager= new ScheduleManager(userInfo)
  const fileManager = new FileManager(userInfo)
  const filesInformation = await fileManager.filterFiles()
  const round = scheduleManager.getRoundsOfChecked()[0]
  if (filesInformation && filesInformation.length !== 0) {
    console.log(round, filesInformation)
    asyncRun({ 
      serverFunction: 'filesUpload', 
      args: [{ userInfo, filesInformation, round }]
      })
      .then(({ message }) => {
        clearDriveInput()
        const alert = makeAlert('success')
        alert(message)

      })
      .then(async () => {
        await scheduleManager.loadSchedules()
        scheduleManager.syncSchedules()
      })
      .catch(err => {
        console.error(err)
        clearDriveInput()
        const alert = makeAlert('danger')
        alert(err)
        
      })
  } else {
    clearDriveInput()
    const alert = makeAlert('warning')
    alert(' 업로드 할 파일이 없습니다.')
    
  } 
}
/****************************
 * 신규 스케줄 등록하기
 * **************************/
// 신규 스케줄 박스 보이게 하거나 닫기
const addScheduleBox = function () {
  const $addSchedule = document.querySelector('#add-schedule')
  const classes = $addSchedule.classList
  //console.log(classList)
  if (classes.contains('d-none')) {
    classes.remove('d-none')
  } else {
    classes.add('d-none')
  }
}
// 
const clearAddSchedule = function () {
  document.querySelector('#lecture-date-input').value = ''
  document.querySelectorAll('.exam-code').forEach($code => $code.value = '')      
}


/********************
 * alert object 만들기
 * 함수 객체 형태로 만듦
 ********************/
const makeAlert = function (type = '') { // type 은 danger, warning, success 
  const $alert = document.querySelector(`.alert-${type}`)
  return (message = '') => {
    const $textNode = document.createTextNode(message)
    $alert.append($textNode) 
    $alert.classList.remove('d-none')
    $alert.focus()
    setTimeout(() => { 
      $alert.classList.add('d-none')
      $textNode.parentNode.removeChild($textNode)
      }, 4000)   
  }
}

/*****************************************
 * 클릭 이벤트 핸들러와 인풋 이벤트 핸들러 만들기
 *****************************************/
// clickEventHandler와 inputEventHandler 등록하기
const clickEventHandler = async function (e) {
  
  if (e.target.matches("#save-student")) {
    initializeStudent()     
  }
  if (e.target.matches(".write-schedule")) {
    loadStudyScheduleView(e)
  }
  if (e.target.matches("#activation")) {
    await activate()
  }
  if (e.target.matches("#drive-upload-btn")) {
    sendFilesToGoogleDrive()
  }
  if (e.target.matches("#add-schedule-btn")) {
    addScheduleBox()
  }
  if (e.target.matches("#save-new-schedule")) {
    addNewSchedule()
  }
}
const inputEventHandler = function (e) {
  if(e.target.matches('#student-info')) {
    searchStudent(e)
  }
  if (e.target.matches('.edit-schedule')) {
    changeScheduleReadOnly(e)
  }        
} 
// eventListener 달기
app.addEventListener('input', inputEventHandler)
app.addEventListener('click', clickEventHandler)
search.addEventListener('click', loadSearchView)
addStudent.addEventListener('click',loadAddStudentView)
document.addEventListener('DomContentLoaded', getStudentsBasicInfo)

