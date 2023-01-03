let commentArr = document.querySelectorAll(".comment-button");
let modalBackground = document.querySelector(".modal-background");
let commentExitButton = document.querySelector("#modal-exit-button");
let modalPostContainer = document.querySelector(".modal-post-container");
let modalForm = document.querySelector(".comment-form");
let likeButtonArr = document.querySelectorAll(".like-button");
let time = document.querySelectorAll(".user-time-posted");
let deleteButtonArr = document.querySelectorAll(".delete-button");
let deleteModalForm = document.querySelector(".delete-form");
let deleteModalBackground = document.querySelector(".delete-modal-background")
let deleteExitButton = document.querySelector("#delete-exit-button");

for(let i = 0; i < time.length; i++){
    let arr = time[i].childNodes[1].childNodes[3].innerText.split(' ')
    if(arr.length > 3 ){
        time[i].childNodes[1].childNodes[3].innerText = arr[2] + ' ' + arr[3] + ' ' + arr[4]
    }
}

if((commentExitButton || deleteExitButton) !== null){
    deleteExitButton.addEventListener('click', () => {
        modalBackground.classList.remove('active');
        deleteModalBackground.classList.remove('active');
        clearModal();
    })
    commentExitButton.addEventListener('click', () => {
        modalBackground.classList.remove('active');
        deleteModalBackground.classList.remove('active');
        clearModal();
    })
}

for(let i = 0; i < deleteButtonArr.length; i++){
    deleteButtonArr[i].addEventListener('click', async (event) => {
        let post = event.currentTarget.parentNode.parentNode.childNodes[3];
        let postId;
        console.log(post.childNodes)
        if(post.childNodes[3].className === '') {
            postId = post.childNodes[3].innerText;
        } else {
            postId = post.childNodes[5].innerText;
        }

        document.querySelector(".yes-delete-button").addEventListener('click', async () => {
                await fetch(`post/deletePOST/${postId}`, {
                method: "DELETE",
            });
            
        })

        deleteModalBackground.classList.add('active');
    })
}

for(let i = 0; i < commentArr.length; i++){
    commentArr[i].addEventListener('click', (event) => {
        let user = event.currentTarget.parentNode.parentNode.childNodes[1];
        let post = event.currentTarget.parentNode.parentNode.childNodes[3];
        let postId = post.childNodes[3].innerText;
        modalPostContainer.appendChild(user.cloneNode(true));
        modalPostContainer.appendChild(post.cloneNode(true));
        modalForm.action = `/comments/comment/${postId}`
        modalBackground.classList.add('active');
    })
}

function clearModal(){
    modalPostContainer.removeChild(modalPostContainer.childNodes[0])
    modalPostContainer.removeChild(modalPostContainer.childNodes[0])
}

for(let i = 0; i < likeButtonArr.length; i++){
    likeButtonArr[i].addEventListener('click', async (event) => {
        let post = event.currentTarget.parentNode.parentNode.childNodes[3];
        let postId;
        if(post.childNodes.length === 5){
            postId = post.childNodes[3].innerText
        } else {
            postId = post.childNodes[5].innerText
        }
        
        toggleLike(postId, i)
    })
}

async function toggleLike(postId, i){
    let likeButtonSpan = document.querySelectorAll(".like-button-span")
    likeButtonArr[i].classList.toggle('active')
    if(likeButtonArr[i].className === 'interaction-icons like-button active'){
        let response = await fetch(`/post/likePost/${postId}`, {
            method: 'PUT'
        })
        likeButtonSpan[i].innerText = parseInt(likeButtonSpan[i].innerText) + 1
    } else {
        let response = await fetch(`/post/removeLike/${postId}`, {
            method: 'PUT'
        })
        likeButtonSpan[i].innerText = parseInt(likeButtonSpan[i].innerText) - 1
    }
}