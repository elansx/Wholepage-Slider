

function XYSlider(container_id, options) {
    let sections = document.getElementsByTagName("section")
    let container = document.getElementById(container_id)
    let translateY_section = 0
    let translate_pages = []
    let width = 100, height = 100
    let colors = options.colors


    let current_page_per_section = []
    let current_section = 0
    let wait_scroll = false
    let wait_page = false
    let swiping = null
    let swiping_direction = null
    const wait_time = 200
    const percent = 20
    let moving = false
 
        

    // SECTION SWITCH BUTTONS (UP/DOWN BUTTONS)
    const section_button_container = document.createElement("div")
    section_button_container.className = "section_selection"
    container.appendChild(section_button_container)



    // INITILIZE ALL SECTIONS, PAGES (AND BUTTONS FOR PAGES)

        for (let index = 0; index < sections.length; index++) {

            //INIT ARRAY FOR PAGES
            translate_pages[index] = 0
            current_page_per_section[index] = 0

            //SET COLOR FOR EACH SECTION
            sections[index].style.background = colors[index]

       
            //CREATE RADIO BUTTONS FOR SECTIONS
            let button_dots = document.createElement("input")
            button_dots.type = "radio"
            button_dots.name = `section`
            button_dots.id = `section[${index}]`
            button_dots.style.display = "none"
            button_dots.value = index
            button_dots.onclick = function(e) {     
                    if(wait_scroll) { 
                        e.preventDefault()
                    } else {
                        scrollSections(e)     
                    }         
            }
            button_dots.checked = current_section === index ? true : false
            section_button_container.appendChild(button_dots)

                // CREATE LABELS FOR BUTTONS
                let button_label = document.createElement("label")
                button_label.htmlFor = `section[${index}]`
                section_button_container.appendChild(button_label)

            
            // COUNT PAGES IN EACH SECTION
            let pages = sections[index].getElementsByClassName("page")


            //IF THERE IS MORE THEN ONE PAGE DRAW BUTTONS
            if(pages.length > 1) { 



            //CREATE BUTTON CONTAINER FOR PAGES (#1)
            let page_button_container = document.createElement("div")
            page_button_container.className = "page_selection"
            sections[index].appendChild(page_button_container)


            

            // CREATE PAGE BUTTONS (FOR EVERY SECTION)
                for (let i = 0; i < pages.length; i++) {


                    //DRAW BUTTONS AND PUT THEM IN CONTAINER (#1)
                    let page_button  = document.createElement("input")
                    page_button.type = "radio"
                    page_button.id = `page[${index}][${i}]`
                    page_button.name = `pagination[${index}]`
                    page_button.style.display = "none"
                    page_button.value = i
                    page_button.onclick = function() {  selectPages(this) } 
                    page_button.checked = current_page_per_section[i] === i ? true : false
                    page_button_container.appendChild(page_button)
                    
                

                        //CREATE LABELS (VISUALS) FOR BUTTONS
                        let page_button_label = document.createElement("label")
                        page_button_label.htmlFor = `page[${index}][${i}]`
                        page_button_container.appendChild(page_button_label)


                }
                

                // ALIGN BUTTONS IN CENTER OF SCREEN (BECAUSE WE NEVER KNOW DIMENSIONS OF THE BUTTON CONTAINER)
                page_button_container.style.left = `calc(50% - ${page_button_container.getBoundingClientRect().width/2}px)`
                section_button_container.style.top = `calc(50% - ${section_button_container.getBoundingClientRect().height/2}px)`


            }




        }



   
function scrollSections(e) {

        // CHECK IF THERE IS ANY SECTIONS CREATED
        if(!sections && sections.length <= 0) { return } 

        // IF WAITING FOR ANIMATION (SECTION SWITCH) TO COMPLETE - RETURN, BEFORE SWICHING NEXT SECTION
        if(wait_scroll) { return } wait_scroll = true


    


        // DETECT SWIPE-UP OR SCROLL-UP AND PREVENT FROM CHANGING DIRECTION WHILE DRAGGING
        if((e.deltaY > 0 || e === "up"  && swiping_direction != 'down') && current_section < sections.length-1 )
        { 
            current_section++
            translateY_section -= height
        }

        // DETECT SWIPE-DOWN OR SCROLL-DOWN AND PREVENT FROM CHANGING DIRECTION WHILE DRAGGING
        else if((e.deltaY < 0 || e === "down"  && swiping_direction != 'up') && current_section > 0)
        {
            current_section--
            translateY_section += height
        }

        // DETECT CLICK FROM NAVIGATION (BUTTON)   
        else if(e.type === "click") 
        {
            let click = parseInt(e.target.value) - current_section
            current_section = parseInt(e.target.value)
            translateY_section = translateY_section - (height * click)
        }

        // RESTORE SECTION POSITION, JUST IN CASE - IF THERE WAS DRAGGING UP OR DOWN, BUT CHANGED DIRECTION (TO LEFT OR RIGHT - CANCELED)
        else
        {
        translateY_section = Math.round(translateY_section/100)*100
        }
       




        // MOVING/DRAGGING ENDED SO RESTORE SETTINGS
        moving = false
        height = 100


        // SHOW ACTIVE BUTTON - WHICH SECTION IS SELECTED (DISPLAYED)
        let button = document.getElementById(`section[${current_section}]`)
        button.checked = true

        // THE MAIN PART - UPDATE AND SWITCH SECTIONS (ANIMATE VIA CSS)
        for (let index = 0; index < sections.length; index++) {
            sections[index].style.transform = `translateY(${translateY_section}%)`     
        }


        // LET PREVIOUS ANIMATION COMPLETE BEFORE SWITCHING SECTIONS
        setTimeout(() => {
            wait_scroll = false
        }, wait_time)


    }




   

function selectPages(e) {



                        // CHECK IF THERE IS ANY SECTIONS CREATED
                        if(!sections && sections.length <= 0) { return } 

                        // IF WAITING FOR ANIMATION (PAGE SWITCH) TO COMPLETE - RETURN, BEFORE SWICHING NEXT PAGE
                        if(wait_page) { return } wait_page = true
                        

                        // GET ALL PAGES IN CURRENT SECTION
                        let pages = sections[current_section].getElementsByClassName("page")
                       

                        // DETECT SWIPE-LEFT AND PREVENT FROM CHANGING DIRECTION (UP OR DOWN) WHILE DRAGGING
                        if(e === 'left' && swiping_direction != 'right' && current_page_per_section[current_section] < pages.length-1) {
                            current_page_per_section[current_section]++
                            translate_pages[current_section] -= width
                        }

                        // DETECT SWIPE-RIGHT AND PREVENT FROM CHANGING DIRECTION (UP OR DOWN) WHILE DRAGGING
                        else if(e === 'right' && swiping_direction != 'left' && current_page_per_section[current_section] > 0)
                        {
                            current_page_per_section[current_section]--
                            translate_pages[current_section] += width
                        }

                        // DETECT CLICK FROM NAVIGATION (BUTTON)     
                        else if(e.type === "click")
                        {
                            let click = parseInt(e.target.value) - current_page_per_section[current_section]
                            current_page_per_section[current_section] = parseInt(e.target.value)
                            translate_pages[current_section] = translate_pages[current_section] - (width * click)
                        }
                        

                        // RESTORE SECTION POSITION, JUST IN CASE - IF THERE WAS DRAGGING LEFT OR RIGHT, BUT CHANGED DIRECTION (TO UP OR DOWN - CANCELED)
                        else
                        {
                            translate_pages[current_section] = Math.round(translate_pages[current_section]/100)*100      
                        }


            
                        // MOVING/DRAGGING ENDED SO RESTORE SETTINGS
                        moving = false
                        width = 100



                        // SHOW ACTIVE NAVIGATION BUTTON - WHICH PAGE IS SELECTED (DISPLAYED)
                        let button = document.getElementById(`page[${current_section}][${current_page_per_section[current_section]}]`)      
                        button.checked =  true



                        // THE MAIN PART - UPDATE AND SWITCH SECTIONS (ANIMATE VIA CSS)
                        for (let index = 0; index < pages.length; index++) {
                            pages[index].style.transform = `translateX(${translate_pages[current_section]}%)`
                        }


                        // LET PREVIOUS ANIMATION COMPLETE BEFORE SWITCHING SECTIONS
                        setTimeout(() => {
                            wait_page = false
                        }, wait_time)

                        
    }
    
  








  ///////////////////////////////////////////////////////
 //// HANDLING DRAGGING/MOVING EFFECT BEFORE SWIPE /////
/////////////////////////////////////////////////////// 
    


function swipeMove(e) {

    // IF THERE WAS NO STARTED MOVEMENT/DRAGGING - RETURN
    if(!moving) { return }



    // SAVE SWIPING DIRECTION TO COMPARE AFTER SWIPE IS COMPLETED/ENDED
    // [AS THIS FUNCTION IS UPDATED ONLY ONCE PER DRAG]
    swiping_direction = swiping




    // CHECK IF SWIPING LEFT OR RIGHT AND WE AREN'T WAITING FOR PREVIOUS ANIMATION TO COMPLETE
    if((swiping === 'left' || swiping === 'right') && !wait_page)
    {

        // GET PAGE LIST FOR CURRENT SECTION (PAGES THAT BELONG TO CURRENT SECTION)
        let pages = sections[current_section].getElementsByClassName("page")


        // UPDATE TRANSLATE DIMENSIONS IF DRAGGING LEFT
        if(swiping === 'left') { 
            width -= percent
            translate_pages[current_section] -= percent
         }
        

         // UPDATE TRANSLATE DIMENSIONS IF DRAGGING RIGHT
        if(swiping === 'right') {
            width -= percent
            translate_pages[current_section] += percent
        } 



        // ANIMATE SECTIONS IF DRAGGING LEFT OR RIGHT
        for (let index = 0; index < pages.length; index++) {
            pages[index].style.transform = `translateX(${translate_pages[current_section]}%)`
        }
    

    } 
    



    // CHECK IF SWIPING UP OR DOWN AND WE AREN'T WAITING FOR PREVIOUS ANIMATION TO COMPLETE
    if(swiping === 'up' || swiping === 'down' && !wait_scroll)    
    {


        // UPDATE TRANSLATE DIMENSIONS IF DRAGGING UP   
        if(swiping === 'up') { 
            height -= percent
            translateY_section -=percent
         }
        
        // UPDATE TRANSLATE DIMENSIONS IF DRAGGING DOWN
        if(swiping === 'down') {    
             height -= percent
             translateY_section +=percent
         }



        // ANIMATE SECTIONS IF DRAGGING UP OR DOWN
        for (let index = 0; index < sections.length; index++) {
            sections[index].style.transform = `translateY(${translateY_section}%)`     
        }


    }

    
    // WE HAVE DONE ALL THE STUFF - DON'T DO ANYTHING
    moving = false

}











  ///////////////////////////////////////////////
 //// EVENT LISTENERS AND HANDLING SWIPES //////
///////////////////////////////////////////////




// SETUP EVENT LISTENERS
window.onwheel = scrollSections
window.onmousedown = handleTouchStart
window.onmousemove = handleTouchMove
window.onmouseup = handleTouchEnd
window.ontouchstart = handleTouchStart
window.ontouchmove = handleTouchMove
window.ontouchend = handleTouchEnd


// SETUP VARIABLES NEEDED TO HANDLE SWIPES
var first_touch_y = null
var first_touch_x = null                                                        
var last_touch_x = null
var last_touch_y = null


// DETECT MOBILE OR DESKTOP SWIPE
function getTouches(event) {
    let touch = event.touches ? event.touches[0] : event
    return touch
}



// GET THE FIRST TOUCH POSITION
function handleTouchStart(event) {
    swiping = null // SET TO NULL IF THERE WAS PREVIUS SWIPING
    moving = true // TO ACTIVATE swipeMove() MOVING FUNCTION  

    // GET THE FIRST TOUCH  POSITION                                
    first_touch_x = getTouches(event).clientX                                      
    first_touch_y = getTouches(event).clientY                                      
}                                               






// GET THE LAST TOUCH POSITION AND CALCULATE SWIPE DIRECTION
function handleTouchMove(event) {




    // IF THERE WASN'T A REGISTRED FIRST TOUCH THEN RETURN (WEIRD, huh?)
    if ( ! first_touch_x || ! first_touch_y ) { return }



    // SET/UPDATE LAST TOUCH POSITION
    last_touch_x = getTouches(event).clientX
    last_touch_y = getTouches(event).clientY  




    // CALCULATE DIFFERENCE BETWEEN FIRST AND LAST POSITION
    let xDiff = first_touch_x - last_touch_x
    let yDiff = first_touch_y - last_touch_y



    
    // IF SWIPED LEFT/RIGHT
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) )

            { swiping = xDiff > 0 ? 'left' : 'right' }

    // ELSE UP/DOWN
    else

            { swiping = yDiff > 0 ? 'up' : 'down' }

    

    // ACTIVATE ACTUAL FUNCTION TO ANIMATION DRAGGING
    swipeMove()
    
}




// AFTER SWIPE IS ENDED [TOUCH / CLICK RELEASED] HANDLE ACTUAL SWIPING
function handleTouchEnd() {

   
    // CHECK IF SWIPING/DRAGGING ACCURED - NOT CLICKED/PRESSED
    if(swiping) {  
        
        // SEND INFORMATION ABOUT SWIPE TO BOTH HANDLERS [SECTION AND PAGE] 
        // BECAUSE THEY "KNOW" WHAT TO DO WHEN SWIPE WAS FOR THEM OR NOT

        scrollSections(swiping) // SECTION HANDLER
        selectPages(swiping) // PAGES HANDLER


    }

        // RESET SETTINGS AFTER SWIPE IS COMPLETED/ENDED
        first_touch_x = null
        first_touch_y = null 
        swiping = null
        moving = false
    }



}









