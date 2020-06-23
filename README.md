## Whole page slider

You can see a working [demo here](https://elansx.github.io/Wholepage-Slider/)

![Whole Page Slider](https://i.imgur.com/M6s4n7B.gif "Whole Page Slider")

## Features

* No dependencies
* Written in pure Javascript
* Works great on mobile and desktop devices
* Auto-generates navigation (buttons) based on sections and pages


### Quick start

Copy and paste this in your html file

```
<!DOCTYPE html>
<html>
<head>
    
    <title>WholePage Slider</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/elansx/Slider/slider.css">
    
</head>

<body>
     <div id="wholepage">
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
    </div>
    
 
    <script src="https://cdn.jsdelivr.net/gh/elansx/Slider/slider.js"></script>
    <script>
        new WholePageSlider("wholepage", {
            colors: ['deepskyblue', 'orange']
        })
    </script>

</body>
</html>
```
## License

MIT License Copyright (c) 2020 elansx
