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
    // We need a container to store our buttons for section scroll
    const sectionButtonContainer = this.createElement('div', { className: 'sectionButtonContainer' }, this.container)



    // Create elements for every section and apply styles
    for (let index = 0; index < this.sections.length; index++) {
      this.translate.page[index] = 0
      this.currentPage[index] = 0
      this.sections[index].style.background = this.options.colors ? this.options.colors[index] : 'white'
      this.pagesPerSection[index] = this.sections[index].getElementsByClassName('page')


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




      if (this.pagesPerSection[index].length > 1) {
        
        // We need a container where to store our navigation buttons for pages
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
        sectionButtonContainer.style.top = `calc(50% - ${sectionButtonContainer.getBoundingClientRect().height / 2}px)`

      }


    }
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
      console.log('up')
    } else
    if (((swipeOrClick.deltaY < 0 || swipeOrClick === 'down') && this.swipeStartDirection !== 'up') && (this.currentSection > 0)) {
      this.currentSection--
      this.translate.section += this.height
      console.log('down')
    } else  
    if (swipeOrClick.type === 'click') {
      console.log('click')
      const click = parseInt(swipeOrClick.target.value) - this.currentSection
      this.currentSection = parseInt(swipeOrClick.target.value)
      this.translate.section = this.translate.section - (this.height * click)
    } else {
      this.translate.section = Math.round(this.translate.section / 100) * 100
    }

  
    
    // SHOW ACTIVE BUTTON - WHICH SECTION IS SELECTED (DISPLAYED)
    const button = document.getElementById(`sectionId[${this.currentSection}]`)
    button.checked = true
    // MOVING/DRAGGING ENDED SO RESTORE SETTINGS
    this.isDragging = false
    this.height = 100
    
    // THE MAIN PART - UPDATE AND SWITCH SECTIONS (ANIMATE VIA CSS)
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
    } else if (swipeOrClick === 'right' && this.swipeStartDirection !== 'left' && (this.currentPage[this.currentSection] > 0)) {
      this.currentPage[this.currentSection]--
      this.translate.page[this.currentSection] += this.width
    } else if (swipeOrClick.type === 'click') {
      console.log(this.currentPage[this.currentSection])
      const getDirectionFromClick = parseInt(swipeOrClick.target.value) - this.currentPage[this.currentSection]
      this.currentPage[this.currentSection] = parseInt(swipeOrClick.target.value)
      this.translate.page[this.currentSection] = this.translate.page[this.currentSection] - (this.width * getDirectionFromClick)
    } else {
      this.translate.page[this.currentSection] = Math.round(this.translate.page[this.currentSection] / 100) * 100
    }


    this.isDragging = false
    this.width = 100
    
    // SHOW ACTIVE NAVIGATION BUTTON - WHICH PAGE IS SELECTED (DISPLAYED)
    const button = document.getElementById(`page[${this.currentSection}][${this.currentPage[this.currentSection]}]`)
    if (button) {
      button.checked = true
    }
    
    
    // THE MAIN PART - UPDATE AND SWITCH SECTIONS (ANIMATE VIA CSS)
    for (let index = 0; index < this.pagesPerSection[this.currentSection].length; index++) {
      this.pagesPerSection[this.currentSection][index].style.transform = `translateX(${this.translate.page[this.currentSection]}%)`
    }
    
    // LET PREVIOUS ANIMATION COMPLETE BEFORE SWITCHING SECTIONS
    setTimeout(() => {
      this.waitAnimation = false
    }, this.timeToAnimate)


  }

  draggingEffect () {


    if (!this.isDragging) {
      return
    }

    // SAVE SWIPING DIRECTION TO COMPARE AFTER SWIPE IS COMPLETED/ENDED
    // [AS THIS FUNCTION IS UPDATED ONLY ONCE PER DRAG]
    this.swipeStartDirection = this.swipeEndDirection

    // CHECK IF SWIPING LEFT OR RIGHT AND WE AREN'T WAITING FOR PREVIOUS ANIMATION TO COMPLETE
    if ((this.swipeStartDirection === 'left' || this.swipeStartDirection === 'right') && !this.waitAnimation) {

      const pages = this.pagesPerSection[this.currentSection]

      // UPDATE TRANSLATE DIMENSIONS IF DRAGGING LEFT
      if (this.swipeStartDirection === 'left') {
        this.width -= this.draggingPercent
        this.translate.page[this.currentSection] -= this.draggingPercent
      }

      // UPDATE TRANSLATE DIMENSIONS IF DRAGGING RIGHT
      if (this.swipeStartDirection === 'right') {
        this.width -= this.draggingPercent
        this.translate.page[this.currentSection] += this.draggingPercent
      }

      // ANIMATE SECTIONS IF DRAGGING LEFT OR RIGHT
      for (let index = 0; index < pages.length; index++) {
        pages[index].style.transform = `translateX(${this.translate.page[this.currentSection]}%)`
      }
    }

    // CHECK IF SWIPING UP OR DOWN AND WE AREN'T WAITING FOR PREVIOUS ANIMATION TO COMPLETE
    if ((this.swipeStartDirection === 'up' || this.swipeStartDirection === 'down') && !this.waitAnimation) {
      // UPDATE TRANSLATE DIMENSIONS IF DRAGGING UP
      if (this.swipeStartDirection === 'up') {
        this.height -= this.draggingPercent
        this.translate.section -= this.draggingPercent
      }

      // UPDATE TRANSLATE DIMENSIONS IF DRAGGING DOWN
      if (this.swipeStartDirection === 'down') {
        this.height -= this.draggingPercent
        this.translate.section += this.draggingPercent
      }

      // ANIMATE SECTIONS IF DRAGGING UP OR DOWN
      for (let index = 0; index < this.sections.length; index++) {
        this.sections[index].style.transform = `translateY(${this.translate.section}%)`
      }
    }

    // WE HAVE DONE ALL THE STUFF - DON'T DO ANYTHING
    this.isDragging = false

  }

  getTouchOrClick (event) {
    const touch = event.touches ? event.touches[0] : event
    return touch
  }

  touchStart (event) {
    this.isDragging = true 

    // GET THE FIRST TOUCH  POSITION
    this.touches.startX = this.getTouchOrClick(event).clientX
    this.touches.startY = this.getTouchOrClick(event).clientY
  }

  touchMove (event) {
    // IF THERE WASN'T A REGISTRED FIRST TOUCH THEN RETURN (WEIRD, huh?)
    if (!this.touches.startX || !this.touches.startY) { 
      return
    }

    

    // SET/UPDATE LAST TOUCH POSITION
    this.touches.endX = this.getTouchOrClick(event).clientX
    this.touches.endY = this.getTouchOrClick(event).clientY

    // CALCULATE DIFFERENCE BETWEEN FIRST AND LAST POSITION
    this.touches.differenceX = this.touches.startX - this.touches.endX
    this.touches.differenceY = this.touches.startY - this.touches.endY

    // We need to know vertical or horizontal swipe accured and then left/right or up/down
    if (Math.abs(this.touches.differenceX) > Math.abs(this.touches.differenceY)) {
      this.swipeEndDirection = this.touches.differenceX > 0 ? 'left' : 'right'
    } else {
      this.swipeEndDirection = this.touches.differenceY > 0 ? 'up' : 'down'
    }

    // ACTIVATE ACTUAL FUNCTION TO ANIMATION DRAGGING
    this.draggingEffect()
   
  }

  touchEnd () {

    if (this.swipeEndDirection) {   
      this.switchAndTranslatePage(this.swipeEndDirection)
      this.switchAndTranslateSection(this.swipeEndDirection)
    }

    // RESET SETTINGS AFTER SWIPE IS COMPLETED/ENDED
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
