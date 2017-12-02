window.addEventListener('load', () => {
  const accountContainer = document.querySelector('.accounts-page-container'),
        accountNameTitle = document.querySelector('.account-name'),
        editButton = document.querySelector('.account-name .edit')

  editButton.addEventListener('click', () => {
    let titleValue = document.querySelector('.account-name'),
        child = titleValue.firstChild,
        texts = [],
        input = document.createElement('input')

    // this loop collects text in only the parent element
    while(child) {
      if (child.nodeType == 3) {
        texts.push(child.data)
      }
      child = child.nextSibling
    }
    let oldAccountTitle = texts.join(""),
        titleLength = oldAccountTitle.length

    input.value = oldAccountTitle
    input.classList.add("account-name-edit")
    input.style.width = titleLength + "ch"
    // accountContainer.appendChild(input)
    accountNameTitle.replaceWith(input)
    input.addEventListener('input', (e) => {
      titleLength = input.value.length * .9
      input.style.width = titleLength + "ch"
    })
    input.addEventListener('keypress', (e) => {
      let windowparams = window.location.pathname
      let windowsparams = windowparams.substr(windowparams.lastIndexOf('/') + 1)
      if (e.keyCode == 13) {
        fetch('/funds/update/name', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accountName: input.value,
            pathid: windowsparams,
            user: local_data
          })
        })
        .then(res => {
          return res.text()
        })
        .then(rdata => {
          data = JSON.parse(rdata)
          console.log(data.accountName)
          let title = document.createElement('div')
          let edit = document.createElement('p')
          title.classList.add("account-name")
          edit.classList.add("edit")
          title.textContent = data.accountName
          edit.textContent = "edit"
          title.appendChild(edit)
          input.replaceWith(title)
        })
        .catch((err) => {
          console.log("Failed fetch error: ", err)
        })
      }
    })
  })




})