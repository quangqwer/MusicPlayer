const $=document.querySelector.bind(document)
        const $$=document.querySelectorAll.bind(document)

        const player = $('.player')
        const cd=$('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playbtn = $('.btn-toggle-play')
        const progress = $('#progress')
        const prevbtn = $('.btn-prev')
        const nextbtn = $('.btn-next')
        const randombtn = $('.btn-random')
        const repeatbtn = $('.btn-repeat')
        const playlist = $('.playlist')
        const option = $(".option")
        const progressduration = $(".progress__duration")
        const progresscurrent = $(".progress__current")
        const app={
            currentIndex: 0,
            isPlaying: false,
            isRandom:false,
            isRepeat:false,
            isTimeUpdate:true,
            songs:[
                {
                    name:'Độ tộc 2',
                    singer:'Masew,Độ Mixi,Pháo,Phúc Du',
                    path: './asset/music/song1.mp3',
                    image: './asset/img/song1.jpg'
                },
                {
                    name:'Dịu Dàng Em Đến',
                    singer:'ERIK,NinjaZ',
                    path: './asset/music/song2.mp3',
                    image: './asset/img/song2.jpg'
                },
                {
                    name:'Nàng Kiều',
                    singer:'Nal,RyoT',
                    path: './asset/music/song3.mp3',
                    image: './asset/img/song3.jpg'
                },
                {
                    name:'Love City',
                    singer:'Phúc Bồ, Snoop Dee',
                    path: './asset/music/song4.mp3',
                    image: './asset/img/song4.jpg'
                },
                {
                    name:'Thắt Chặt',
                    singer:'DMYB',
                    path: './asset/music/song5.mp3',
                    image: './asset/img/song5.jpg'
                },
                {
                    name:'Thức Giấc',
                    singer:'Da LAB',
                    path: './asset/music/song6.mp3',
                    image: './asset/img/song6.jpg'
                },
                {
                    name:'Câu Hẹn Câu Thề',
                    singer:'Đình Dũng, ACV',
                    path: './asset/music/song7.mp3',
                    image: './asset/img/song7.jpg'
                },
                {
                    name:'Phải Chăng Em Đã Yêu?',
                    singer:'Juky San, RedT',
                    path: './asset/music/song8.mp3',
                    image: './asset/img/song8.jpg'
                },
                {
                    name:'Sài Gòn Đau Lòng Quá',
                    singer:'Hứa Kim Tuyền, Hoàng Duyên',
                    path: './asset/music/song9.mp3',
                    image: './asset/img/song9.jpg'
                },
                {
                    name:'Có hẹn với thanh xuân',
                    singer:'MONSTAR',
                    path: './asset/music/song10.mp3',
                    image: './asset/img/song10.jpg'
                },
            ],
            render:function(){
                const html = this.songs.map((song,index) =>{
                    return`
                    <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                            <div class="thumb" style="background-image: url('${song.image}')">
                            </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    `
                })
                playlist.innerHTML = html.join('')
            },
            defineProperties: function(){
                Object.defineProperty(this,'currentSong',{
                    get:function(){
                        return this.songs[this.currentIndex]
                    }
                })
            },
            handleEvent: function(){
                const _this = this;
                const cdwidth= cd.offsetWidth

                //Xử lý cd quay /dừng
                const cdThumAnimate =cdThumb.animate([
                    {transform: 'rotate(360deg)'}
                ],{
                    duration: 10000,//10s
                    iterations :Infinity//vòng lặp
                })
                cdThumAnimate.pause()
                //Xử lý phóng to thu nhỏ cd
        
                document.onscroll = function(){
                    const scrollTop =window.scrollY || document.documentElement.scrollTop
                    const newcdwidth = cdwidth - scrollTop
                    
                    cd.style.width = newcdwidth>0 ? newcdwidth+'px' :0
                    cd.style.opacity = newcdwidth / cdwidth 
                }

                //Xử lý khi click play
                playbtn.onclick = function(){
                    if(_this.isPlaying){
                        audio.pause()
                    }
                    else{
                        audio.play()
                    }
                }

                //khi song được play play
                audio.onplay = function(){
                    _this.isPlaying =true
                    player.classList.add('playing')
                    cdThumAnimate.play()
                }
                //khi song bị pause play
                audio.onpause = function(){
                    _this.isPlaying =false
                    player.classList.remove('playing')
                    cdThumAnimate.pause()
                }

                //khi tiến độ bài hát thay đổi
                //currentTime thời gian hiện tại lúc chạy
                //duration trả về độ dài của song
                audio.ontimeupdate=function(){
                    if(_this.isTimeUpdate) {
                        if(audio.duration){
                            const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                            progress.value= progressPercent
                            progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progressPercent + '%, #d3d3d3 ' + progressPercent + '%, #d3d3d3 100%)'
                        }
                        
                    }
                    _this.timeCurrent()
                    _this.timeDuration()
                }
                // sử lý khi tua
                progress.onmousedown = ()=>{
                    _this.isTimeUpdate = false; //
                    progress.onchange = (e) => {
                        const seekTime = audio.duration / 100 * e.target.value;
                        audio.currentTime = seekTime;
                    }
                }
                progress.onmouseup = ()=> {
                    _this.isTimeUpdate = true;
                }
                // forward and rewind on mobile
                document.querySelector('#progress').addEventListener('touchstart', touchStart);
                function touchStart() {
                    progress.oninput = (e) => {
                        const seekTime = audio.duration / 100 * e.target.value;
                        audio.currentTime = seekTime;
                    }
                }
                //khi next song
                nextbtn.onclick=function(){
                    if(_this.isRandom){
                        _this.randomSong()
                    }else{
                        _this.nextSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }
                //khi prev song
                prevbtn.onclick=function(){
                    if(_this.isRandom){
                        _this.randomSong()
                    }else{
                        _this.prevSong()
                    }
                    audio.play()
                    _this.render()
                }
                //Random bat tat
                randombtn.onclick = function(){
                    _this.isRandom = !_this.isRandom
                    randombtn.classList.toggle('active',_this.isRandom)
                }
                //xử lý lặp bài hát
                repeatbtn.onclick = function(){
                    _this.isRepeat = !_this.isRepeat
                    repeatbtn.classList.toggle('active',_this.isRepeat)
                }
                //Xử lý next song khi audio ended
                audio.onended = function(){
                    if(_this.isRepeat){
                        audio.play()
                    }else{
                        nextbtn.click()
                    }
                }
                //lắng nghe hành vi click vào play list
                playlist.onclick =function(e){
                    let songNode = e.target.closest('.song:not(.active)')
                    if(!e.target.closest('.option')){
                        //XỦ lý khi click vào song
                        if(songNode){
                            _this.currentIndex= Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                        }
                        //Xử lý khi click vào option
                    }
                }
            },
            scrollToActiveSong: function(){
                setTimeout(function(){
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block:'nearest'
                    })
                },200)
            },
            loadCurrentSong: function(){

                heading.textContent = this.currentSong.name
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path 
            },
            nextSong: function(){
                this.currentIndex++
                if(this.currentIndex >= this.songs.length){
                    this.currentIndex=0
                }
                this.loadCurrentSong()
            },
            prevSong: function(){
                this.currentIndex--
                if(this.currentIndex < 0){
                    this.currentIndex = this.songs.length-1
                }
                this.loadCurrentSong()
            },
            randomSong:function(){
                let newIndex
                do{
                    newIndex= Math.floor(Math.random()*this.songs.length)
                }while(newIndex ===this.currentIndex )
                this.currentIndex = newIndex
                this.loadCurrentSong()
            },
            formatTime: function (sec_num) {
                let hours = Math.floor(sec_num / 3600);
                let minutes = Math.floor((sec_num - hours * 3600) / 60);
                let seconds = Math.floor(sec_num - hours * 3600 - minutes * 60);

                hours = hours < 10 ? (hours > 0 ? '0' + hours : 0) : hours;

                if (minutes < 10) {
                minutes = '0' + minutes;
                }
                if (seconds < 10) {
                seconds = '0' + seconds;
                }
                return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
            },
            // hiển thị thời gian bài hát hiện tại
            timeCurrent: function () {
                setInterval(() => {
                    let cur = this.formatTime(audio.currentTime)
                    progresscurrent.textContent = `${cur}`;
                    }, 100)
            },
            //hiển thị thời gian bài hát
            timeDuration: function () {
                if(audio.duration){
                    let dur = this.formatTime(audio.duration)
                    progressduration.textContent = `${dur}`;
                }
            },
            start:function(){
                //Định nghĩa các thuộc tính cho obj
                this.defineProperties()

                //Lắng nghe /Xử lý sự kiện(DOM event)
                this.handleEvent()

                //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
                this.loadCurrentSong()

                //Render Playlist
                this.render()
            },
        }
        app.start()