import Swiper from '../../../node_modules/swiper/swiper-bundle.esm.browser.js'
import '../../../node_modules/swiper/swiper-bundle.min.css'
const infoDiv = document.createElement('div')
infoDiv.classList.add('MIT_info')

infoDiv.innerHTML = `
     <div class="MIT_info__wrapper">
       <div class="MIT_info__inner">
        <article>
            <h1>Hi Folks!</h1>
            <p>
                If like me you was a big fan of  "Point & Click" games from the 90's, you probably know the <a href="https://en.wikipedia.org/wiki/Monkey_Island_(series)" target="_blank">Monkey Island Saga</a>! So many hours spent on it... 
            </p>
            <p style="display:inline">
               I hope you enjoyed it.  <pre style="display:inline">  Sébastien Lempens</pre>
            </p>
        </article>
        <div class="MIT_info__gallery">
            <div class="swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-1.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-1.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>
                    Based on my <a href="https://www.deviantart.com/slempens" target="_blank">digital draw</a> from 2012 I thought,<br>why do not reproduce it in Webgl? That's what I tried to do :)
                    </legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-2.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-2.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>
                        I started working with <a href="https://www.maxon.net/en/cinema-4d" target="_blank">Cinema 4D</a> to modeling 3D elements. 
                    </legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-3.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-3.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>
                       I'm not a 3D expert but I got what I wanted.
                       <br>To save time, I downloaded this "Guybrush" model from <a href="https://sketchfab.com/3d-models/guybrush-threepwood-idle-b0b14f34f99143279e198a75e326d8c2" target="_blank">sketchfab (Artikora Artist)</a>
                    </legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-4.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-4.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>I discovered <a href="https://www.adobe.com/products/substance3d-painter.html" target="_blank">Adobe Substance 3D Painter</a> for texturing... Impressive!</legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-5.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-5.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>I applied custom procedural textures & materials to my 3D objects.
                    <br>Learning curve was not too difficult.</legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-6.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-6.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend class="void"></legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-7.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-7.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend class="void"></legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-8.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-8.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>
                        I used the amazing library <a href="https://threejs.org" target="_blank">Three.js</a> to develop my  project.
                        <br>It uses Webgl API which is implemented right into the browser.
                    </legend>
                </div>
                <div class="swiper-slide">
                    <picture>
                    <source type="image/webp" media="(max-width: 425px)" 
                    srcset="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-9.jpg?as=webp&width=400')}" />
                        <img src="${require('../images/gallery-wip/monkey-island-tribute-wip-slide-9.jpg?as=webp&width=1200')}">
                    </picture>
                    <legend>I'm already thinking about my next project. Thanks for watching :)</legend>
                </div>
            </div>
            <div class="swiper-pagination"></div>
            </div>
        </div>
       </div>
     </div>
    `
document.querySelector('body').append(infoDiv)
new Swiper('.MIT_info__gallery > .swiper', {
  grabCursor: true,
  effect: 'creative',
  creativeEffect: {
    prev: {
      shadow: false,
      translate: ['-20%', 0, -1],
    },
    next: {
      shadow: false,
      translate: ['100%', 0, 0],
    },
  },
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: false,
  },
})

export { infoDiv }
