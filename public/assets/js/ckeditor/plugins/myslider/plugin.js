CKEDITOR.plugins.add( 'myslider', {
    icons: 'slider',
    init: function( editor ) {
        editor.addCommand( 'insertSlider', {

            exec: function( editor ) {
                editor.insertHtml( `<!-- Swiper -->
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 1" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 2" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 3" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 4" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 5" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 6" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 7" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 8" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 9" style="width:100%"> </div>
      <div class="swiper-slide"> <img src="/uploads/images/placeholder.jpg" alt="Slide 10" style="width:100%"> </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
    <!-- Add Arrows -->
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>` );
            }
        });
        editor.ui.addButton( 'Slider', {
            label: 'Slider Ekle',
            command: 'insertSlider',
            toolbar: 'insert'
        });
    }
});
