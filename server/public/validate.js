var Validate =  function(object) {
    let formElement = document.querySelector(object.form)
    // khi người dùng submit
    formElement.onsubmit = function(e) {
        e.preventDeault()
        
    }
    
 }
 
 Validate.testRegex = function(inputElement, messageElement, conditions) {
     let isTrue = true
     for(let i = 0; i < conditions.length; i++) {
         if(!conditions[i].regex.test(inputElement.value)) {
             inputElement.parentNode.classList.add('invalid')
             messageElement.innerText = conditions[i].message
             isTrue = false
             break
         }
     }
     if(isTrue) {
         inputElement.parentNode.classList.remove('invalid')
         messageElement.innerText = ''
         return inputElement.value
         
     } else {
         return undefined
     }
 }
 
 Validate.testExisted = async function(inputElement, messageElement, message, server) {
    // let result = false
    // const xhr = new XMLHttpRequest()
    // xhr.open("POST", server)
    // xhr.setRequestHeader("Content-Type", "application/json")
    // xhr.send(JSON.stringify({email: inputElement.value}))
    // xhr.onload = function() {
    //     if(JSON.parse(xhr.response).message) {
    //         messageElement.innerText = message
    //     } else {
    //         messageElement.innerText = ''
    //         result = true
    //     }
    // }
    // return reulst
    const response = await fetch(server, {
        method: 'post',
        body: JSON.stringify({email: inputElement.value}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const jsonResponse = await response.json();
    console.log('checking');
    if(jsonResponse.message) {
        messageElement.innerText = message
        console.log('email bị trùng');
        return false
    } else {
        messageElement.innerText = ''
        return true
    }
 }

 Validate.testConfirm = function(inputConfirmElement, inputElement, messageElement, message) {
     if(inputConfirmElement.value === inputElement.value && inputConfirmElement.value) {
         inputConfirmElement.parentNode.classList.remove('invalid')
         messageElement.innerText = ''
         return inputConfirmElement.value
     } else {
         inputConfirmElement.parentNode.classList.add('invalid')
         messageElement.innerText = message
         return undefined
     }
 }
 
 Validate.testChose = function(inputElements, messageElement, message) {
     let values = []
     inputElements.forEach((inputElement) => {
         if(inputElement.checked) {
             values.push(inputElement.value)
         }       
     })
     if(values.length) {
         messageElement.innerText = ''
         inputElements[0].parentNode.classList.remove('invalid')
         return values
     } else {
         messageElement.innerText = message
         inputElements[0].parentNode.classList.remove('invalid')
         return undefined
     }
 }
 
 Validate.isValidate = function(selectorInput, selectorMessage, conditions) {
     let inputElement = document.querySelector(selectorInput);
     let messageElement = inputElement.parentNode.querySelector(selectorMessage);
     inputElement.onblur = function() {
         // khi người dùng blur thì kiểm tra điều kiện regex
         Validate.testRegex(inputElement, messageElement, conditions)
     }
     inputElement.oninput = function() {
         inputElement.parentNode.classList.remove('invalid')
         messageElement.innerText = ''
     }
     return {
         params: [inputElement, messageElement, conditions],
         method: Validate.testRegex
     }
 }
 
 Validate.isExisted = function(selectorInput, selectorMessage, message, server) {
    let inputElement = document.querySelector(selectorInput);
    let messageElement = inputElement.parentNode.querySelector(selectorMessage);
    inputElement.onchange = function() {
        Validate.testExisted(inputElement, messageElement, message, server)
    }
    inputElement.oninput = function() {
        inputElement.parentNode.classList.remove('invalid')
        messageElement.innerText = ''
    }
    return {
        params: [inputElement, messageElement, message, server],
        method: Validate.testExisted
    }
 }

 Validate.isConfirm = function(selectorInput, selectorConfirmInput, selectorMessage, message) {
     let inputElement = document.querySelector(selectorInput);
     let inputConfirmElement = document.querySelector(selectorConfirmInput)
     let messageElement = inputConfirmElement.parentNode.querySelector(selectorMessage)
     inputConfirmElement.onblur = function() {
         // khi người dùng blur thì kiểm tra confirm password
        Validate.testConfirm(inputConfirmElement, inputElement, messageElement, message)
     }
     return {
         params: [inputConfirmElement, inputElement, messageElement, message],
         method: Validate.testConfirm
     }
 }
 
 Validate.isChose = function(selectorInputs, selectorMessage, message) {
     let inputElements = document.querySelectorAll(selectorInputs)
     let messageElement = inputElements[0].parentNode.querySelector(selectorMessage)
     inputElements = Array.from(inputElements)
     inputElements.forEach((inputElement) => {
         inputElement.onclick = function(e) {
             Validate.testChose(inputElements, messageElement, message)
         }
     })
     return {
         params: [inputElements, messageElement, message],
         method: Validate.testChose
     }
 }
