const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particles = []

const mouse = {
  active: false,
  x: null,
  y: null,
  radius: 120
}

window.onmousemove = ({ x, y }) => {
  mouse.x = x
  mouse.y = y
}

document.onmouseenter = () => mouse.active = true
document.onmouseleave = () => mouse.active = false

ctx.font = '24px Roboto Mono, bold'
ctx.fillText('Jakub', 20, 40)
ctx.fillText('Wolak', 30, 65)

const textCoordinates = ctx.getImageData(0, 0, 120, 100)

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.size = 2
    this.baseX = this.x
    this.baseY = this.y

    this.density = Math.random() * 25 + 1
  }

  draw() {
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
  }

  update() {
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y

    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

    const forceDirectionX = dx / distance
    const forceDirectionY = dy / distance

    const maxDistance = mouse.radius
    const force = (maxDistance - distance) / maxDistance

    const directionX = forceDirectionX * force * this.density
    const directionY = forceDirectionY * force * this.density

    if (distance < mouse.radius) {
      this.size = 1.5 + (mouse.radius - distance) / 80
    } else {
      this.size = 1.5
    }

    if (distance < mouse.radius && mouse.active) {
      this.x -= directionX
      this.y -= directionY
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX
        this.x -= dx / 4
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY
        this.y -= dy / 4
      }
    }
  }
}

const init = () => {
  particles = []

  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
        const randX = Math.floor((Math.random() * 10 - 5) / 1.2)
        const randY = Math.floor((Math.random() * 10 - 5) / 1.2)

        const positionX = x * 10 + randX;
        const positionY = y * 10 + randY;

        particles.push(new Particle(positionX, positionY))
      }
    }
  }
}
init()

const connect = () => {
  const maxDistance = 25

  for (let a = 0; a < particles.length; a++) {
    for (let b = 0; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x
      const dy = particles[a].y - particles[b].y

      const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

      if (distance < maxDistance) {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2 * ((maxDistance - distance) / maxDistance)
        ctx.opacity = ((maxDistance - distance) / maxDistance)
        ctx.beginPath()
        ctx.moveTo(particles[a].x, particles[a].y)
        ctx.lineTo(particles[b].x, particles[b].y)
        ctx.stroke()
      }
    }
  }
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(x => {
    x.draw()
    x.update()
  })

  connect()
  requestAnimationFrame(animate)
}
animate()
