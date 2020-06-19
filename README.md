## Whole page slider

You can see a working [demo here](https://elansx.github.io/Slider/)

Swiping works on both - mobile (touch) and desktop (mouse) devices.


### Quick start

Copy and paste this in your html file

```
<!DOCTYPE html>
<html>
<head>
    
    <title>XYSlider</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/elansx/Slider/slider.css">
    
</head>

<body id="page">
       
    <section>
        <div class="page">
            <h1>Section 1!</h1>
            <p>Get ready for some awesomeness..</p>
        </div>  
              <div class="page">
            <h1>Section 2 PAGE 2!</h1>
            <p>Get ready for some awesomeness..</p>
        </div> 
    </section>
    
    
 
    <script src="https://cdn.jsdelivr.net/gh/elansx/Slider/slider.js"></script>
    <script>
        XYSlider("page", {
            colors: ['lightskyblue', 'orange']
        })
    </script>

</body>
</html>
