const getMessage = (msg) => {
    if (msg.name == 'settings') {
        setValues(msg.message);
    }
};
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const waitChangesOnElement = (el, event, success) => {
    el.addEventListener(event, () => {
        sleep(500).then(() => {
            success();
        });
    });
};
const fireEventOnElement = (el, event) => {
    if (el.fireEvent) {
        (el.fireEvent('on' + event));
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(event, true, false);
        el.dispatchEvent(evObj);
    }
};
const login = () => {
    sleep(500).then(() => {
        let el = document.querySelector('#_mainmenuportlet_WAR_mainmenuportlet_INSTANCE_mainmenu_bm-login-form button[type=submit]');
        if (!el) {
            el = document.getElementById('BtnLogin');
        }
        fireEventOnElement(el, 'click');
    });
};

const setValues = (settings) => {
    const millecode      = settings.millecode;
    const doctype        = settings.doctype;
    const password       = settings.password;
    const autoLogin      = settings.autologin;
    const usePassword    = settings.usePassword;
    const documentNumber = Object.assign([], settings.documentNumber);
    let el;

    let validData = millecode !== undefined && millecode !== null && millecode !== ''
        && documentNumber !== undefined && documentNumber !== null && documentNumber !== '';
    if (usePassword) {
        validData = validData && password !== undefined && password !== null && password !== ''
    }

    if (!validData) {
        console.warn('Millennium Login : Please3 provide full personal data for extension');

        return;
    }

    el = document.getElementById('millekod');
    if (!el) {
        el = document.getElementById('ctl00_Content_Login_Multicode_txtContent');
    }

    if (el && el.tagName === 'input') {
        el.value = millecode;

        if (autoLogin) {
            login();
        }

        return;
    }

    if (window.location.pathname.indexOf('osobiste2/LoginSignIn') === 1) {
        el = document.getElementById('ctl00_Content_Login_PasswordOne_txtContent');
        el.value = password;

        el = document.getElementById('Content_Login_SecurityDigits_DocumentTypes_ddlList');
        el.focus();

        waitChangesOnElement(el, 'change', () => {
            let array = document.querySelectorAll('input[type=password]');
            for (let i = 0; i < array.length; i++) {
                if ((array[i].name.indexOf('ctl00$Content$Login$SecurityDigits$Password$' + doctype + '_Container$' + doctype + '_') === 0) && !array[i].disabled) {
                    let index = Object.assign([], array[i].name.replace('ctl00$Content$Login$SecurityDigits$Password$' + doctype + '_Container$' + doctype + '_',''))[0];
                    index = parseInt(index);
                    array[i].value = documentNumber[index];
                }
            }
            if (autoLogin) {
                login();
            }
        });

        el.value = doctype;
        fireEventOnElement(el, 'change');
    }
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        safari.self.addEventListener('message', getMessage, false);
        safari.self.tab.dispatchMessage('getSettings');
    }
};
