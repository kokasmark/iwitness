import Cookies from 'js-cookie';

var userToken = "";

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand()+"-"+new Date().getMonth()+"/"+new Date().getDate(); // to make it longer
};

export function userInit(){
    if(Cookies.get('token') == undefined || Cookies.get('token') == ''){
        requestDailyToken();
    }
    if(Cookies.get('token').split('-')[1] != new Date().getMonth()+"/"+new Date().getDate()){
        requestDailyToken();
    }
}

function requestDailyToken(){
    userToken = token();
    console.log(userToken);
    Cookies.set('token', userToken, { expires: 1, secure: false });
}
export function getUserToken(){
    return Cookies.get('token');
}
export function compareToken(t){
    if(t === userToken){
        return true;
    }
    else{
        return false;
    }
}

