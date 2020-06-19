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
            <h1>First section</h1>
            <p>..and it's first page</p>
        </div>  
              <div class="page">
            <h1>First section</h1>
            <p>..and it's second page</p>
        </div> 
    </section>

    <section>
        <div class="page">
            <h1>Second section</h1>
            <p>..and it's first page</p>
        </div>  
        
        <div class="page">
            <h1>Second section</h1>
            <p>..and it's second page</p>
        </div> 

        <div class="page">
            <h1>Second section</h1>
            <p>..and it's third page</p>
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
```
