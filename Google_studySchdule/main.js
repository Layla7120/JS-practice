// 시작 프로그램
function onOpen(){
  loadColorMenu()
  loadModalDialogMenu('Study Schedule')
}

// test initializer
const testInitializer = function () {
  userInfo = { userName: '이재영', userCode: '81022' }
  initializeStudent(userInfo)
}