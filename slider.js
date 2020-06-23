const WholePageSlider = class {
  constructor (containerId, options) {
    this.container = document.getElementById(containerId)
    this.sections = document.getElementsByTagName('section')

    this.pagesPerSection = []
    this.currentPage = []
    this.currentSection = 0

    this.isDragging = false
    this.draggingPercent = 20

    this.waitAnimation = false
    this.timeToAnimate = 300
    
    this.height = 100
    this.width = 100

    this.swipeStartDirection = null
    this.swipeEndDirection = null
    
    this.options = {
      ...options
    }
    this.translate = {
      section: 0,
      page: []
    }
    
    this.touches = {
      startX: null,
      startY: null,
      endX: null,
      endY: null,
      differenceX: null,
      differenceY: null
    }
    
    this.init()
    this.setupEventListeners()


  }

  init () {

    const sectionButtonContainer = this.createElement('div', { className: 'sectionButtonContainer' }, this.container)

    // Create elements for every section and apply styles
    for (let index = 0; index < this.sections.length; index++) {

      this.translate.page[index] = 0
      this.currentPage[index] = 0
      this.sections[index].style.background = this.options.colors ? this.options.colors[index] : 'white'
      this.pagesPerSection[index] = this.sections[index].getElementsByClassName('page')

      // We need to be sure what there is more then one section before creating navigation
      if (this.sections.length > 1) {

        const sectionNavigationButton = this.createElement('input', {
          type: 'radio',
          name: 'sectionScrollButton',
          id: `sectionId[${index}]`,
          value: index,
          onclick: this.switchAndTranslateSection.bind(this),
          checked: this.currentSection === index,
          style: {
            display: 'none'
          }
        }, sectionButtonContainer)

        this.createElement('label', { htmlFor: sectionNavigationButton.id }, sectionButtonContainer)
        
      }

      // Create navigation for pages only if there is more than 1 page per section
      if (this.pagesPerSection[index].length > 1) {
        
        const buttonContainer = this.createElement('div', { id: `pageButtonContainer[${index}]`, className: 'page_selection' }, this.sections[index])

        for (let i = 0; i < this.pagesPerSection[index].length; i++) {

          this.createElement('input', {
            type: 'radio',
            id: `page[${index}][${i}]`,
            name: `pagination[${index}]`,
            value: i,
            checked: this.currentPage[i] === i,
            onclick: this.switchAndTranslatePage.bind(this),
            style: {
              display: 'none'
            }
          }, buttonContainer)

          this.createElement('label', {
            htmlFor: `page[${index}][${i}]`
          }, buttonContainer)

        }

        buttonContainer.style.left = `calc(50% - ${buttonContainer.getBoundingClientRect().width / 2}px)`
      }
    }

    sectionButtonContainer.style.top = `calc(50% - ${sectionButtonContainer.getBoundingClientRect().height / 2}px)`
  }

 

  switchAndTranslateSection (swipeOrClick) {
   
    if (!this.sections || this.sections.length < 1 || this.waitAnimation) {
      return
    } else {
      this.waitAnimation = true
    }

    if (((swipeOrClick.deltaY > 0 || swipeOrClick === 'up') && this.swipeStartDirection !== 'down') && (this.currentSection < this.sections.length - 1)) {
      this.currentSection++
      this.translate.section -= this.height
    } else
    if (((swipeOrClick.deltaY < 0 || swipeOrClick === 'down') && this.swipeStartDirection !== 'up') && (this.currentSection > 0)) {
      this.currentSection--
      this.translate.section += this.height
    } else  
    if (swipeOrClick.type === 'click') {
      const click = parseInt(swipeOrClick.target.value) - this.currentSection
      this.currentSection = parseInt(swipeOrClick.target.value)
      this.translate.section = this.translate.section - (this.height * click)
    } else {
      this.translate.section = Math.round(this.translate.section / 100) * 100
    }

    // This is needed to show active page on navigation buttons
    const button = document.getElementById(`sectionId[${this.currentSection}]`)
    if (button) {
      button.checked = true
    }
   

    this.isDragging = false
    this.height = 100
    

    for (let index = 0; index < this.sections.length; index++) {
      this.sections[index].style.transform = `translateY(${this.translate.section}%)`
    }

    setTimeout(() => {
      this.waitAnimation = false
    }, this.timeToAnimate)
  }



  switchAndTranslatePage (swipeOrClick) {

    if (swipeOrClick === 'left' && this.swipeStartDirection !== 'right' && (this.currentPage[this.currentSection] < this.pagesPerSection[this.currentSection].length - 1)) {
      this.currentPage[this.currentSection]++
      this.translate.page[this.currentSection] -= this.width
    } else
    if (swipeOrClick === 'right' && this.swipeStartDirection !== 'left' && (this.currentPage[this.currentSection] > 0)) {
      this.currentPage[this.currentSection]--
      this.translate.page[this.currentSection] += this.width
    } else
    if (swipeOrClick.type === 'click') {
      const getDirectionFromClick = parseInt(swipeOrClick.target.value) - this.currentPage[this.currentSection]
      this.currentPage[this.currentSection] = parseInt(swipeOrClick.target.value)
      this.translate.page[this.currentSection] = this.translate.page[this.currentSection] - (this.width * getDirectionFromClick)
    } else {
      this.translate.page[this.currentSection] = Math.round(this.translate.page[this.currentSection] / 100) * 100
    }

    this.isDragging = false
    this.width = 100
    
    // This is needed to show active page on navigation buttons
    const button = document.getElementById(`page[${this.currentSection}][${this.currentPage[this.currentSection]}]`)
    if (button) {
      button.checked = true
    }
    
    for (let index = 0; index < this.pagesPerSection[this.currentSection].length; index++) {
      this.pagesPerSection[this.currentSection][index].style.transform = `translateX(${this.translate.page[this.currentSection]}%)`
    }
    
    setTimeout(() => {
      this.waitAnimation = false
    }, this.timeToAnimate)
  }



  draggingEffect () {
    if (!this.isDragging) {
      return
    }

    // Save start swiping direction to compare when touch/click ended
    this.swipeStartDirection = this.swipeEndDirection

    if ((this.swipeStartDirection === 'left' || this.swipeStartDirection === 'right') && !this.waitAnimation) {

      const pages = this.pagesPerSection[this.currentSection]

      if (this.swipeStartDirection === 'left') {
        this.width -= this.draggingPercent
        this.translate.page[this.currentSection] -= this.draggingPercent
      } else
      if (this.swipeStartDirection === 'right') {
        this.width -= this.draggingPercent
        this.translate.page[this.currentSection] += this.draggingPercent
      }

      for (let index = 0; index < pages.length; index++) {
        pages[index].style.transform = `translateX(${this.translate.page[this.currentSection]}%)`
      }

    }

    if ((this.swipeStartDirection === 'up' || this.swipeStartDirection === 'down') && !this.waitAnimation) {
     
      if (this.swipeStartDirection === 'up') {
        this.height -= this.draggingPercent
        this.translate.section -= this.draggingPercent
      } else
      if (this.swipeStartDirection === 'down') {
        this.height -= this.draggingPercent
        this.translate.section += this.draggingPercent
      }

      for (let index = 0; index < this.sections.length; index++) {
        this.sections[index].style.transform = `translateY(${this.translate.section}%)`
      }
    }

    this.isDragging = false
  }



  getTouchOrClick (event) {
    const touch = event.touches ? event.touches[0] : event
    return touch
  }



  touchStart (event) {
    this.isDragging = true 
    this.touches.startX = this.getTouchOrClick(event).clientX
    this.touches.startY = this.getTouchOrClick(event).clientY
  }



  touchMove (event) {
    if (!this.touches.startX || !this.touches.startY) { 
      return
    }

    this.touches.endX = this.getTouchOrClick(event).clientX
    this.touches.endY = this.getTouchOrClick(event).clientY

    this.touches.differenceX = this.touches.startX - this.touches.endX
    this.touches.differenceY = this.touches.startY - this.touches.endY

    // We need to know vertical or horizontal swipe accured and then left/right or up/down
    if (Math.abs(this.touches.differenceX) > Math.abs(this.touches.differenceY)) {
      this.swipeEndDirection = this.touches.differenceX > 0 ? 'left' : 'right'
    } else {
      this.swipeEndDirection = this.touches.differenceY > 0 ? 'up' : 'down'
    }

    this.draggingEffect()
  }



  touchEnd () {
    if (this.swipeEndDirection) {   
      this.switchAndTranslatePage(this.swipeEndDirection)
      this.switchAndTranslateSection(this.swipeEndDirection)
    }

    this.isDragging = false
    this.touches.startX = null
    this.touches.startY = null
    this.swipeStartDirection = null
    this.swipeEndDirection = null
  }
  

  createElement (tag, options, parent) {
    try {
      const getParent = (typeof parent) === 'object' ? parent : document.getElementById(parent)
      const createElement = document.createElement(tag)
      
      for (const key in options) {

        if (key === 'style') {

          for (const style in options[key]) {
            createElement.style[style] = options[key][style]
          }

        } else if (key === 'onclick') {
         
          createElement.addEventListener('click', options[key])
          
        } else {
          createElement[key] = options[key]
        }

      }
      
      getParent.appendChild(createElement)
      return createElement
      
    } catch (error) {
      this.handleError('Unable to create buttons', error)
    }
  }

  setupEventListeners () {
    window.onwheel = this.switchAndTranslateSection.bind(this)
    window.onmousedown = this.touchStart.bind(this)
    window.onmousemove = this.touchMove.bind(this)
    window.onmouseup = this.touchEnd.bind(this)
    window.ontouchstart = this.touchStart.bind(this)
    window.ontouchmove = this.touchMove.bind(this)
    window.ontouchend = this.touchEnd.bind(this)
  }


  handleError (string, error) {
    console.warn(`${string}: `, error)
  }
}
