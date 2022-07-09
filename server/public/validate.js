var Validate = function(object) {
    let formElement = document.querySelector(object.form)
    formElement.onsubmit = async function(e) {
        e.preventDefault()
        let isTrue = true
        for(let i = 0; i < object.rules.length; i++) {
            let result = await object.rules[i].method(...object.rules[i].params)
            console.log(result);
            if(!result)
                isTrue = false
        }
        if(isTrue)
           formElement.submit()
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
         return true
         
     } else {
         return false
     }
 }
 
 Validate.testExisted = function(inputElement, messageElement, message, server) {
    console.log('testExisted');
    const response = fetch(server, {
        method: 'post',
        body: JSON.stringify({email: inputElement.value}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response
    .then(data => data.json())
    .then(dataJson => {
        if(dataJson.message) {
            messageElement.innerText = message
            console.log('email bị trùng');
            return false
        } else {
            console.log('not existed')
            messageElement.innerText = ''
            return true
        }
    })
 }

 Validate.testConfirm = function(inputConfirmElement, inputElement, messageElement, message) {
     if(inputConfirmElement.value === inputElement.value && inputConfirmElement.value) {
         inputConfirmElement.parentNode.classList.remove('invalid')
         messageElement.innerText = ''
         return true
     } else {
         inputConfirmElement.parentNode.classList.add('invalid')
         messageElement.innerText = message
         return false
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
         return true
     } else {
         messageElement.innerText = message
         inputElements[0].parentNode.classList.remove('invalid')
         return false
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