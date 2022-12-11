function isDup(){
    const request = new XMLHttpRequest();
    const username =  document.getElementById('username')

    if(username.value){
        request.open('get',`find-dup?userName=${username.value}`)
        request.send();
    }else{
        console.log('none');
    }
    request.onload= ()=>{
    if(request.responseText){
        console.log('duplicate users');
    } else{
        console.log('no conflict ');
    }       
    }
    

}