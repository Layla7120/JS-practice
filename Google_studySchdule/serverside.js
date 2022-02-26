// 읽은 컨텐츠를 dialog에 보내는 함수 
const loadModalDialog = function (dialogName = '') {
  return html => {
    SpreadsheetApp.getUi()
    .showModalDialog(html, dialogName)
  } 
}

const studySchedule = function () {
  // 사이즈 지정
  const size = {
    width : 1280,
    height : 768
  }
  // 함수를 파이프로 연결
  return U.pipe(
    getHtmlContent(),
    loadModalDialog('Student Schedule Management')
  )({ fileName: 'index', size })
}

// 스케줄 메뉴를 업로드
const loadModalDialogMenu = function (menuName = '') {
  SpreadsheetApp
    .getUi()
    .createMenu(menuName)
    .addItem('학습 스케줄 관리', 'studySchedule')
    .addToUi()
}

// 학생 초기화 함수
// 시트에 학생의 시작 시트, 드라이브에 폴더, 클래스룸에 시작 지점을 차례대로 만드는 함수
function initializeStudent (userInfo = {}) {
  userSheet(userInfo)
  userFolder(userInfo)
  makeCourseWork(userInfo)
}

// 학생들의 정보를 시트 탭에서 뽑는 함수
// 시트에서 시트이름을 모두 모음
const getSheetNames = function () {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  return ss.getSheets().map(sheet => sheet.getSheetName())
}
// 필요 없는 시트 이름을 빼고
const takeOut = function (nameForOut) {
  return array => array.filter(item => nameForOut !== item)
}

// 시트 이름을 { userName, userCode } 정리해서 리턴
const makeNameObject = function (spliter) {
  return nameString => {
    const data = nameString.split(spliter)
    const result = {}
    result.userCode = data[0]
    result.userName = data[1]
    return result
  }
}

// 학생들의 이름과 학생 코드를 하나씩 객체로 만들어서 반환하는 함수
// 위의 세 함수를 합쳐서 만듦 
const getStudentBasicInfo = function () {
  const spliter = '-'
  return U.pipe(
    getSheetNames,
    takeOut('DB form'),
    nameStrings => nameStrings.map(nameString => makeNameObject(spliter)(nameString)),
    //console.log
  )()
}

/********************************************* 
* 학생 스케줄에 대한 템플릿을 만들고 거기에 정보 넣기
**********************************************/
// 시트 이름 만들기
const nameTemplate = U.nameTemplate('-')
// 시트 찾아서 리턴
const getSheetFrom = function (sheetName = '') {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  return ss.getSheetByName(sheetName)
}
// 시트에서 values 정보와 background 정보를 리턴하기
const getOriginalData = function (sheet) {
  const values = sheet.getDataRange().getValues().slice(1)
  const backgrounds = sheet.getDataRange().getBackgrounds().slice(1)
  return { values, backgrounds }
}
// 시트데이타에서 객체를 만드는 객체를 만드는 함수
const makeExtractor = function () {
  const getRound = function (scheduleArray = []) {
    this.round = scheduleArray[1]
    return this
  }
  const getGeneratingDate = function(scheduleArray = []) {
    this.generatingDate = [
      scheduleArray[0].getFullYear(), 
      scheduleArray[0].getMonth() + 1, 
      scheduleArray[0].getDate()
      ].join('-') 
    return this
  }
  const getSchedule = function (scheduleArray = [], statusArray = []) {
    const start = 3, end = 13
    const scheduleData = []
    for(let i = start; i < end; i++) {
      scheduleData.push([scheduleArray[i], shiftFromColorToStatus(statusArray[i])])
    }
    //console.log(scheduleData)
    this.schedule = scheduleData
    return this
  }
  const getActivity = function (scheduleArray = []) {
    this.activity = scheduleArray[2]
    return this
  }
  const getLectureDate = function (scheduleArray = []) {
    const lectureDate = scheduleArray[13]
    //console.log(lectureDate)
    if(lectureDate) {
      this.lectureDate = [
      lectureDate.getFullYear(), 
      lectureDate.getMonth() + 1, 
      lectureDate.getDate()
      ].join('-')
    }
    return this   
  }
  return Object.create(Object.assign(Object.create(null), 
    { getRound, getGeneratingDate, getSchedule, getActivity, getLectureDate })
  )
}
// values와 backgrounds를 이용하여 extractor로 정보를 뽑아서 새로운 객체를 만들어서 리턴
const getScheduleData = function ({ values, backgrounds } = {}) {
  const extractors = []
  for (let i = 0; i < values.length; i++) {
    extractors[i] = makeExtractor()
  }
  const data = extractors
  .map((extractor, idx) => {
    extractor
      .getRound(values[idx])
      .getActivity(values[idx])
      .getGeneratingDate(values[idx])
      .getLectureDate(values[idx])
      .getSchedule(values[idx], backgrounds[idx])
    return extractor
  })
  .map(extracted => Object.assign(Object.create(null), extracted))
  return data
}
// 학생 스케줄 정보 정리해서 받기
const getStudentSchedule = function (  //시트에서 userInfo에 맞는 학생의 데이타 받기
  userInfo = { 
    userName: '이요셉', userCode: '80672'}) {
  return U.pipe(
    nameTemplate,
    getSheetFrom,
    getOriginalData,
    getScheduleData,
    //console.log
  ) (userInfo)
}
/*****************************************
 * 서버사이드 매니저
 * 스케줄 매니저, 파일 매니저, 스코어 매니저
 *****************************************/
 // 시트에서 사용할 스케줄 템플릿을 생성하는 객체
const makeScheduleTemplate = function () {
  // 날짜 생성
  const generateDateString = function () {
    const today = new Date()
    this.generatingDate =  [
      today.getFullYear(), 
      today.getMonth() + 1, 
      today.getDate()
      ].join('-') 
    
    return this
  }
  const examCodesToSchedule = function (examCodes = []) {
    const exams = examCodes.map(examCode => [examCode, '생성'])
    this.schedule = exams
    return this
  }
  const activityOn = function () {
    this.activity = 'n'
    return this
  }
  const extractData = function () {
    return { ...this }
  }
  const ProtoType = Object.assign(Object.create(null), 
    { generateDateString, examCodesToSchedule, extractData, activityOn })
  
  return Object.create(ProtoType) // scheduleTemplate 리턴
}

// 스프레드 시트 부르기
const spreadsheetOn = function (spreadsheetId) {
    if(spreadsheetId) {
      return SpreadsheetApp.openById(spreadsheetId)
    }
    return SpreadsheetApp.getActiveSpreadsheet()
 }
 //ScheduleManagerServer
class ScheduleManagerServer {
  constructor (userInfo = {}) {
    this.userInfo = userInfo
  }
  scheduleRowNumber (round) {
    const scheduleSheet = this.getScheduleSheet()
    const lastRow = scheduleSheet.getLastRow()
    const rowIndex = scheduleSheet
      .getRange(1, columunNumbers.ROUND_COL, lastRow, 1)
      .getValues().flat()
      .findIndex(value => value.toString() === round.toString())
    
    return rowIndex + 1
  }
  getExamNumbersToCheck (round) {
    const row = this.scheduleRowNumber(round)
    const statusColors = this.getScheduleSheet()
      .getRange(
        row, 
        columunNumbers.EXAM_START, 
        1, 
        columunNumbers.EXAM_END - columunNumbers.EXAM_START + 1)
      .getBackgrounds()
      .flat()
    return this.getScheduleSheet()
      .getRange(
        row, 
        columunNumbers.EXAM_START, 
        1, 
        columunNumbers.EXAM_END - columunNumbers.EXAM_START + 1)
      .getValues()
      .flat()
      .filter((_, i) => {
        const status = shiftFromColorToStatus(statusColors[i])
        return (status === '포기' || status === '생성')
      })
  }
  
  changeActivity(round) {
    const scheduleSheet = this.getScheduleSheet()
    const lastRow = scheduleSheet.getLastRow()
    // 모든 activity를 n으로 고침
    const activityRanges = []
    for(let r = 2; r <= lastRow; r++) {
      activityRanges.push(scheduleSheet.getRange(r, columunNumbers.ACTIVITY_COL, 1, 1))
    }
    activityRanges.forEach(range => range.setValue('n'))
    // 주어진 round만 y로 고침
    const row = this.scheduleRowNumber(round)
    scheduleSheet.getRange(row, columunNumbers.ACTIVITY_COL, 1, 1).setValue('y')
    console.log('Activity Changed')
  }
  // examcode 에 대한 column number 받기
  columnNumberOfExamCodes (examInfo) { // examInfo = { round: string, examCodes: [examCode] }
    const {round, examCodes } = examInfo
    const row = this.scheduleRowNumber(round)
    const scheduleSheet = this.getScheduleSheet()
    const lastCol = scheduleSheet.getLastColumn()
    return { row, 
      examColumns: examCodes
        .map(examCode => 
          scheduleSheet
            .getRange(row, 1, 1, lastCol)
            .getValues().flat()
            .findIndex(value => value == examCode))
        .map(index => index + 1) // indexNumber start from 0
    }
  }
  // 파일 상태 변화 하고 결과 홈페이지에 돌려주기
  changeFileStatus(locationInfo = {}) { // locationInfo = { row: number, examColumns: [columnOfExamCode]}
    const scheduleSheet = this.getScheduleSheet()
    return status => {
      const { row, examColumns } = locationInfo
    scheduleSheet
      .getRangeList(examColumns.map(col => `R${row}C${col}`))
      .setBackground(shiftFromStatusToColor(status)) // status에 맞게 바꾸기
    console.log('status to changed')
    }          
  }
  // lectureDate와 examCode로 기본적인 스케줄 만들기
  makeBasicSchedule ({ lectureDate = '', examCodes = [] } = {}) {
    const scheduleTemplate = makeScheduleTemplate()
    const takeZeroAway = function (dateStr = '') {
      return dateStr.replace(/(-)(0)/g,'-')
    }
    !lectureDate 
      ? (scheduleTemplate.lectureDate = '') 
      : (scheduleTemplate.lectureDate = takeZeroAway(lectureDate))
    
    scheduleTemplate
      .generateDateString()
      .examCodesToSchedule(examCodes)
      .activityOn()
    
    scheduleTemplate.round = this.getLastRound() + 1

    return scheduleTemplate.extractData()        
  }
  // 스케줄 시트에 업데이트 하기
  updateUserScheduleSheet (userSchedule) {
    const padToRight = function (rightEnd, str = '') {
      return (array = []) => {
        const length = array.length
        if (length >= rightEnd) return array
        const leftPlaceNumber = rightEnd  - length
        const addOn = Array.from({ length: leftPlaceNumber }, () => str)
        return array.concat(addOn)
      } 
    }
    const { 
      generatingDate, 
      activity, 
      round, 
      lectureDate, 
      schedule } = userSchedule
    const padBlank = padToRight(10)

    const rowData = [
    generatingDate, round, activity,
    ...padBlank(schedule.map(examData => examData[0])),
    lectureDate
    ]
    //console.log(rowData)
    this.getScheduleSheet().appendRow(rowData)
    console.log('시트 업데이트 되었습니다.')

  }

  // userInfo에 맞는 sheet 리턴
  getScheduleSheet () {
    return spreadsheetOn().getSheetByName(nameTemplate(this.userInfo))
  }
  // 마지막 라운드 
  getLastRound () {
    const scheduleData = this.getScheduleSheet()
      .getDataRange()
      .getValues()
      .slice(1) // 제목 부분 떼내기
    return scheduleData
      .map(schedule => schedule[1])
      .reduce((max, number) => 
        max >= number ? max : number, 0) // round만 추출해서 그 중에 최대값뽑기
  }
}
// 신규 스케줄 등록하는 함수
const addNewSchedule = function (userInfo = {}, addedSchedule = {}) {
  const { userName, userCode } = userInfo
  const { lectureDate, examCodes } = addedSchedule
  const sm = new ScheduleManagerServer({ userName, userCode })
  const schedule = sm.makeBasicSchedule({ lectureDate, examCodes })
  // 스케줄을 업데이트 하기
  sm.updateUserScheduleSheet(schedule)
  // 스케줄 상태 표시 하기
  const round = sm.getLastRound()

  const changeToGenerated = U.pipe(
    sm.columnNumberOfExamCodes.bind(sm),
    sm.changeFileStatus.bind(sm)  
  ) ({ round, examCodes })
  changeToGenerated('생성')
  return schedule
}

const activate = function (userInfo, round) {
   const scheduleManager = new ScheduleManagerServer(userInfo)
   scheduleManager.changeActivity(round)
   return {userInfo, round}
 }
// 파일 매니저 서버 
class FileManagerServer {
  constructor (userInfo = {}) {
    this.userInfo = userInfo
    this.scheduleManager = new ScheduleManagerServer(userInfo)
  }
  // 해당 폴더 찾거나 만들어서 리턴
  getFolderOf(round) {
    //console.log(this.userInfo)
    const userFolderName = U.nameTemplate('_')(this.userInfo)
    const dateFolderName = getStudentSchedule(this.userInfo)
      .filter(schedule => schedule.round == round)[0]
      .generatingDate

    const userFolders = DriveApp.getFolderById(location.focusRoot).getFolders()
    let userFolder;
    while(userFolders.hasNext()) {
      const folder = userFolders.next()
      if (folder.getName() == userFolderName) {
        userFolder = folder
      }
    }
    
    let examfolder
    if (userFolder) {
      const examFolders = userFolder.getFolders()
      while(examFolders.hasNext()) {
        const folder = examFolders.next()
        if (folder.getName() == dateFolderName) {
          examfolder = folder
        }
      }
    } else {
      console.error(`folder ${userFolderName} hasn't been made`)
      return
    }
    if (examfolder) {
      console.log(`Folder ${dateFolderName} exist.`)
      return examfolder
    } else {
      console.log(`Folder ${dateFolderName} doesn't exist. So we create new one`)
      return userFolder.createFolder(dateFolderName)
    }
  }
  // 파일 데이터를 받아서 파일 블롭을 만듦
  makeFileBlob (filesInformation) {
    const { fileData, fileName, fileType } = filesInformation
    const transFormed = Utilities.base64Decode(fileData);
    // return blob
    return Utilities.newBlob(transFormed, fileType, fileName);
  }
}
// 업로드한 시험지 번호 업데이트
// FileManager 이용하여 파일을 만들어서 원하는 장소에 집어 넣고 시트에 상태 표시하기
const filesUpload = function ({ userInfo, filesInformation, round }, count = 2) {
  const fileManager = new FileManagerServer(userInfo)
  const folder = fileManager.getFolderOf(round)
  const failure = []
  filesInformation
    .map(fileInformation => fileManager.makeFileBlob(fileInformation))
    .forEach((blob, i) => {
      try{
        folder.createFile(blob)
      } catch (err) {
        console.error(err)
        failure.push(filesInformation[i])
      }
    })
  //console.log(`faiure count: ${failure.length}`)
  if(failure.length === 0 || count === 0) {
    // 시트 기록 작업하고 client에 databack
    const sm = fileManager.scheduleManager  // schedule manager
    const allExamCodes = sm.getExamNumbersToCheck(round) // 모든 시험숫자
    const checkers = allExamCodes.map(examCode =>    // 체커 만들기 '시험'과 그냥 두개를 만듦
      [
        makeRegExCheckerForExamCode(examCode.toString()), 
        makeRegExCheckerForExamCode(examCode.toString(), '해설')
      ]
    )
    
    let examCodes = checkers.map((checkerPair, i) => {  // 각 시험코드에 대하여 업데이트 할 수 있는게 있는 지 체크
      let count = 0
      checkerPair.forEach(checker => {
        const files = folder.getFiles()
        while(files.hasNext()) {
          const file = files.next()
          const fileName = file.getName()
          if(checker(fileName)){
            count++
            break
          } 
        }
      })
      
      if (count >= 2) return allExamCodes[i]
      })
    
    examCodes = examCodes.filter(value => value)
    console.log(`전체 코드: ${allExamCodes}`, `남은 코드: ${examCodes}`)
    if(examCodes.length == 0) {
      const message = '해설과 문제지 중 하나가 업로드 되지 않아 상태가 변경되지 않습니다.'
      console.log(message)
      return { messaage }  
    }
    
    const changeToWait  = U.pipe(
      sm.columnNumberOfExamCodes.bind(sm),  //색깔을 바꿔줌
      sm.changeFileStatus.bind(sm)
    )({ round, examCodes })
    changeToWait('대기')
    const message = `${examCodes.join(' ')}에 대한 업로드가 끝났습니다`
    return { message }
  } else {
    // 실패한 것들 모아서 다시 작업
    console.log(count)
    filesUpload({ userInfo, failure, round }, count - 1)
  }
}


