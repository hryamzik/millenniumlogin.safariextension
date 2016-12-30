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

const setValues = (settings) => {
    const millecode      = settings.millecode;
    const doctype        = settings.doctype;
    const password       = settings.password;
    const documentNumber = Object.assign([], settings.documentNumber);

    if (window.location.pathname.indexOf('osobiste2/LoginSignIn') === 1) {
        let el = document.getElementById('ctl00_Content_Login_Multicode_txtContent');
        if (el) {
            el.value = millecode;
            el = document.getElementById('BtnLogin');
            fireEventOnElement(el, 'click');
        } else {
            el = document.getElementById('ctl00_Content_Login_PasswordOne_txtContent');
            el.value = password;

            el = document.getElementById('Content_Login_SecurityDigits_DocumentTypes_ddlList');
            el.focus();
            waitChangesOnElement(el, 'change', () => {
                let array = document.querySelectorAll('input[type=password]');
                for (let i = 0; i < array.length; i++) {
                    if ((array[i].name.indexOf('ctl00$Content$Login$SecurityDigits$Password$'+doctype+'_Container$'+doctype+'_') === 0) && !array[i].disabled) {
                        let index = Object.assign([], array[i].name.replace('ctl00$Content$Login$SecurityDigits$Password$'+doctype+'_Container$'+doctype+'_',''))[0];
                        index = parseInt(index);
                        array[i].value = documentNumber[index];
                    }
                }
                if (settings.autologin) {
                    sleep(500).then(() => {
                        el = document.getElementById('BtnLogin');
                        fireEventOnElement(el, 'click');
                    });
                }
            });
            el.value = doctype;
            fireEventOnElement(el, 'change');
        }
    } else if (window.location.pathname.indexOf('individuals') === 1
        || window.location.pathname.indexOf('klienci-indywidualni') === 1) {
        let el = document.getElementById('millekod');
        el.value = millecode;

        el = document.querySelector('#_mainmenuportlet_WAR_mainmenuportlet_INSTANCE_mainmenu_bm-login-form button[type=submit]');
        fireEventOnElement(el, 'click');
    } else {
        console.log('Wrong page: ' + window.location.pathname);
    }
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.log('onreadystatechange: ' + document.readyState);
        safari.self.addEventListener('message', getMessage, false);
        safari.self.tab.dispatchMessage('getSettings');
    }
};
