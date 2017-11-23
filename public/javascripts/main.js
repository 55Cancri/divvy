
window.onload = function() {

  let error = document.querySelector('.error-msg')
  let success = document.querySelector('.success-msg')

  setTimeout(() => {
    if (error || success) {
      error.classList.add('fade-out')
      success.classList.add('fade-out')
    }
  }, 9000)

  let dropMenu = document.querySelector('.drop-menu')
  let subMenu = document.querySelector('.sub-menu')
  let subMenuItems = [].slice.call(document.querySelectorAll('.sub-menu li'))

  if (dropMenu) {
    dropMenu.addEventListener('click', () => {
      subMenu.classList.toggle('show')
    })
  }
}