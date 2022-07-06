var Validate = function(object) {
   let formElement = document.querySelector(object.form)
   // khi người dùng submit
   formElement.onsubmit = function(e) {
        let isTrue = true
        let values = []
        object.rules.forEach(rule => {
            // chạy tất cả các điều kiện và kiểm tra
            values.push(rule.method(...rule.params))
            if(!values[values.length - 1]) {
                isTrue = false
            }
        });
        if(!isTrue) {
            e.preventDefault()
        } else {
            console.log(values);
            e.preventDefault()
        }
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
