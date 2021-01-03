const fields = document.querySelectorAll('[required]');

function validatyField(field) {
    //verificar se existe erros
    function verifyErrors() {
        let foundError = false;

        for (const key in field.validity) {
            //se n for a propriedade customError, verifica se tem algum erro
            if (field.validity[key] && !field.validity.valid) {
                foundError = key;
            }
        }
        return foundError
    }

    function customMessage(typeError) {
        const messages = {
            text: {
                valueMissing: 'Por favor, preencha este campo!'
            },
            email: {
                valueMissing: 'Email obrigatório!',
                typeMismatch: 'Por favor, use um email válido!'
            }
        };

        return messages[field.type][typeError];
    }

    function setCustomMessage(message) {
        const spanError = field.parentNode.querySelector('span.error');

        if (message) {
            spanError.classList.add('active');
            spanError.innerHTML = message;
        } else {
            spanError.classList.remove('active');
            spanError.innerHTML = '';
        }
    }

    return function() {
        const error = verifyErrors();

        if (error) {
            const message = customMessage(error);
            field.style.borderColor = 'red';
            setCustomMessage(message)
        } else {
            field.style.borderColor = 'green';
            setCustomMessage();
        }

    }
}

function customValidation(event) {
    const field = event.target;

    const validation = validatyField(field);
    validation();
}

for (const field of fields) {
    field.addEventListener('invalid', event => {
        //eliminando o bubble, msn de erro
        event.preventDefault();

        customValidation(event);
    });
    field.addEventListener('blur', customValidation);
}