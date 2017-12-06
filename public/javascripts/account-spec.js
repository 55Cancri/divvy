window.addEventListener('load', () => {
  const accountContainer = document.querySelector('.accounts-page-container'),
        editnButton = document.querySelector('.account-name .edit-n')

  let url = window.location.pathname
  url = url.substr(url.lastIndexOf('/') + 1)





  accountContainer.addEventListener('click', function(e) {
    // if the clicked area is an element, and
    // if the element has the classlist has "edit"
    if(e.target && e.target.classList.contains('edit-n')) {

      let accountNameTitle = document.querySelector('.account-name'),
          titleValue = document.querySelector('.account-name'),
          input = document.createElement('input'),
          child = titleValue.firstChild,
          texts = []

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
      accountContainer.appendChild(input)
      accountNameTitle.replaceWith(input)
      input.addEventListener('input', (e) => {
        titleLength = input.value.length * .9
        input.style.width = titleLength + "ch"
      })


      input.addEventListener('keypress', (e) => {
        if (input.value.length < 15) {
          if (e.keyCode == 13) {
            fetch('/funds/update/name', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                accountName: input.value,
                path: url,
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
              edit.classList.add("edit-n")
              title.textContent = data.accountName
              edit.textContent = "edit"
              title.appendChild(edit)
              input.replaceWith(title)
            })
            .catch((err) => {
              console.log("Failed fetch error: ", err)
            })
          }
        } else {
          e.preventDefault()
        }
      })
    }
  })




  accountContainer.addEventListener('click', function(e) {
    if(e.target && ((e.target.classList.contains('add-d')) || (e.target.classList.contains('edit-d')))) {
      // grab description div, then create input element
      // select the first child of the div and create empty array
      let accountDescriptionDiv = document.querySelector('.account-desc'),
          textArea = document.createElement('textarea'),
          child = accountDescriptionDiv.firstChild,
          texts = []

      // while you are still looping through the child,
      // and the child is still text, push to text array
      // the same for the child siblings too
      // finally, combine that array into the text of that child,
      // and grab the length of it
      while(child) {
        if (child.nodeType == 3) {
          texts.push(child.data)
        }
        child = child.nextSibling
      }
      let oldAccountDescription = texts.join(""),
          descriptionLength = oldAccountDescription.length

      // set the input's value as the old description
      textArea.value = oldAccountDescription

      // set width of new input based on old description's length
      // give it a class that signifies inprogress edit
      // add to account div container and then replce div
      // >>> textArea.style.width = descriptionLength + "ch"
      textArea.classList.add('account-description-edit')
      accountContainer.appendChild(textArea)
      accountDescriptionDiv.replaceWith(textArea)

      // on every input, update length of input
      textArea.addEventListener('input', function(e) {
        textArea.style.height = ""
        textArea.style.height = Math.min(textArea.scrollHeight) + "px"
        // descriptionLength = textArea.value.length
        // textArea.style.width = descriptionLength + "ch"
      })

      // if enter key is pressed, sent to server
      textArea.addEventListener('keypress', (e) => {
        if ((textArea.value.length < 1) && (e.keyCode == 13)) {
          e.preventDefault()
          textArea.placeholder = "Field cannot be empty."
        }
        else if (textArea.value.length < 140) {
          if(e.keyCode == 13) {
            e.preventDefault()
            fetch('/funds/edit/description', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                description: textArea.value,
                path: url,
                user: local_data
              })
            })
            .then(res => {
              return res.text()
            })
            .then(rdata => {
              data = JSON.parse(rdata)
              console.log("Added description: ", data.description)

              // create description div and edit p
              let accountDescriptionDiv = document.createElement('div'),
                  edit = document.createElement('p')

              // give new description div class name
              // give new edit p class name
              accountDescriptionDiv.classList.add("account-desc")
              edit.classList.add("edit-d")

              // set text content of new div equal to server data
              // set text content of edit p to "edit"
              accountDescriptionDiv.textContent = data.description
              edit.textContent = "edit"

              // append edit p tag to description div
              // replace input with created div (and edit p)
              accountDescriptionDiv.appendChild(edit)
              textArea.replaceWith(accountDescriptionDiv)
            })
          }
        } else {
          e.preventDefault()
        }
      })
    }
  })

})