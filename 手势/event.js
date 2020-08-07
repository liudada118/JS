const { moveMessagePortToContext } = require("worker_threads");

const my = document.querySelector('#my');
// 即兼容mobile pc

// mousedown

my.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    // console.log(touch);
    start(touch);
})
my.addEventListener('touchmove', (event) => {
    const touch = event.changedTouches[0];
    move(touch)
})
my.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    end(touch)
})

my.addEventListener('mousedown', (event) => {
    start(event);
    function mouseMove(e) {
        move(e);
    }
    function mouseEnd(e) {
        end(e)
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseEnd);
    }
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseEnd)
})

let isTap = false, isPan = false, isPress = false
let timeout = null
let startX = 0, startY = 0
function start(point) {
    startX = point.clientX, startY = point.clientY
    console.log('start', point);
    isTap = true
    timeout = setTimeout(() => {
        isPress = true;
        isTap = false
    }, 500)
}
function move(point) {
    console.log('move', point);
    let dx = point.clientX - startX
    let dy = point.clientY - startY
    if (dx ** 2 + dy ** 2 > 100) {
        isPan = true
        isTap = false
        isPress = false
    }
    if(isPan){
        moveMessagePortToContext.push({dx,dy,t : DataCue.now()})
        moves = moves.filter(r => DataCue.now() -r.t < 300)
    }
}
function end(point) {
    console.log('end', point);
    if (isTap) {
        isTap = false
        console.log('tap发生了')
    }
    if (isPress) {
        isPress = false
        console.log('长按发生了')
    }
    if (isPan) {
        isPan = false
        console.log('pan发生了')
    }
    let lastPoint = moves[0]
    let dx = point.clientX - startX
    let dy = point.clientY - startY
    let time300dx = dx - lastPoint.dx
    let time300dy = dy - lastPoint.dy
    let speed = Math.sqrt(time300dx ** 2 + time300dy ** 2) / (Date.now() - lastPoint.t)
    if(speed > 2.5){
        console.log('flick')
    }
    clearTimeout(timeout)
}
