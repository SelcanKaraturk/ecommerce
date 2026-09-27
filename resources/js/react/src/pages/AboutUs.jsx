import React from 'react'
import {
  ModeEditOutlined, HandymanOutlined, DiamondRounded, SearchOutlined
} from '@mui/icons-material';
import Instagram from "../layouts/GeneralComponents/Instagram";

function AboutUs() {
  return (
    <>
      <div className="hiraola-slider_area-2">
        <div className="main-slider">
          <div className="single-slide animation-style-01 bg-aboutus">
            <div className="container-fluid">
              <div className="about-content">
                <h6 className="title-6">
                  HAKKIMIZDA
                </h6>
                <h3>
                  Zarafetin Mirası, <br /> değerinin ışıltısı.
                </h3>
                {/* <h2>Zarafet</h2> */}
                <p className="m-0">
                  VALOR, zamansız tasarımları ve usta işçiliğiyle <br /> değerli anılarınızı kalıcı bir mirasa dönüştürür. <br /> Her parça, sizin hikayenizi yansıtır.
                </p>
                <div className="hiraola-btn-ps_center slide-btn">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-us-area">
        <div className="container-fluid" style={{ paddingRight: 0 }}>
          <div className="row mx-0" style={{ backgroundColor: '#ffffff' }}>

            <div className="col-xl-3 col-lg-6 col-md-12 d-flex align-items-center my-5 order-xl-1 order-lg-2 order-2">
              <div className="overview-content">
                {/* <h2>Welcome To <span>Hiraola's</span> Store!</h2> */}
                <h6 className="title-6">BiZİM HİKAYEMİZ</h6>
                <h2>BİR TUTKUYLA BAŞLADI, <br /> BİR MİRASA DÖNÜŞTÜ.</h2>
                <p className="short_desc">
                  Vaor, mücevhere duyulan tutkunun ve estetik anlayışın buluştuğu noktada doğdu. Her tasarımımızda, geçmişin ustalığını geleceğin çizgileriyle birleştiriyor.
                  Modern kadının zarafetini , gücünü ve özgürlüğünü yansıtıyoruz.
                </p>

                <p className="short_desc">
                  Takılarımız, sadece birer aksesuar değil; duyguların, anların ve hatıraların en değerli tamamlayıcısıdır.
                </p>

              </div>
            </div>

            <div className="col-xl-5 col-lg-12 col-md-12 d-flex align-items-center order-xl-2 order-lg-1 order-1">

              <div className="row px-4 about-features-row">
                <div className="col-4">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-diamond">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
                        <path d="M10 12l-2 -2.2l.6 -1" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h6>USTA İŞÇİLİK</h6>
                      <p>Deneyimli ustalarımızın elinden çıkan üstün kalite.</p>
                    </div>
                  </div>

                </div>
                <div className="col-4">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg fill="#b8924a" width="50px" height="50px" viewBox="-3.2 -3.2 38.40 38.40" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#b8924a" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.128"></g><g id="SVGRepo_iconCarrier"> <title>crystals</title> <path d="M16.8 3.758l-4.2 3.484 1.873 13.766 2.425 1.701 2.568-1.602 1.467-13.734zM24.099 12.916l2.536-4.49-1.026-2.075-1.77 0.788-1.7 4.957 0.396 1.981zM9.212 11.169l0.217-1.719-2.474-3.701-1.645-0.672-0.138 1.823 2.474 3.7zM27.561 14.647l-3.429 0.741-4.414 10.572 0.968 2.151 2.942-0.199 5.344-10.054zM6.158 13.534l-1.217 4.057 6.326 9.969 2.27 0.725 0.61-1.87-4.064-12.622z"></path> </g></svg>
                    </div>
                    <div className="text-center">
                      <h6>DOĞAL TAŞLAR VE PIRLANTA</h6>
                      <p>Sertifikalı, özenle seçilmiş değerli taşlar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shield-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /><path d="M15 19l2 2l4 -4" /></svg>
                    </div>
                    <div className="text-center">
                      <h6>GÜVEN & GARANTİ</h6>
                      <p>Tüm ürünlerde 18 ay garanti.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-xl-4 col-lg-6 col-md-12 order-xl-3 order-lg-3 order-3" style={{ paddingRight: 0 }}>
              <div className="overview-img text-center img-hover_effect whoamiImg">
                <a href="#">
                  <img className="img-full" src="/assets/images/whoami.png" alt="Hiraola's About Us Image" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="static-banner_area">
        <div className="container-fluid static-aboutUs">
          <div className="row static-banner-image custimize justify-content-start">
            <div className="col-md-6 col-lg-5 mt-3">
              <div className="row">
                <div className="col-md-9">
                  <h2 className='mb-3'>USTALIK DETAYLARDA SAKLI</h2>
                  <p className="schedule">
                    Her VALOR takısı, usta ellerde hayat bulur. Tasarım aşamasından üretime, taş seçiminden cilalamaya kadar her adım titizlikle ve tutkuyla gerçekleştirilir.
                  </p>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-3 banner-item text-center">
                  <div className="icon"> <ModeEditOutlined /> </div>
                  <h6 className="mt-3">
                    TASARIM
                  </h6>
                  <p>
                    İlhamla şekillenen, özgün tasarımlar.
                  </p>
                </div>

                <div className="col-md-3 banner-item text-center">
                  <div className="icon"> <HandymanOutlined /> </div>
                  <h6 className="mt-3">
                    ÜRETİM
                  </h6>
                  <p>
                    Usta ellerde, titizlikle işlenen her bir parça.
                  </p>
                </div>
                <div className="col-md-3 banner-item text-center">
                  <div className="icon"> <DiamondRounded /> </div>
                  <h6 className="mt-3">
                    TAŞ SEÇİMİ
                  </h6>
                  <p>
                    Sadece en kaliteli ve sertifikalı taşlar.
                  </p>
                </div>
                <div className="col-md-3 banner-item text-center">
                  <div className="icon"> <SearchOutlined /> </div>
                  <h6 className="mt-3">
                    KALİTE KONTROL
                  </h6>
                  <p>
                    Mükemmelliği garanti eden, son dokunuş.
                  </p>
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>

      <div className="about-us-area my-5 py-4 our-values">
        <div className="container-fluid">
          <div className="row" style={{ backgroundColor: '#ffffff' }}>
            <div className="overview-content">
              <h6 className="title-6 text-center pb-0">DEĞERLERİMİZ</h6>
              <div className="section-divider">
                <span></span>
              </div>
              <div className="row about-features-row mt-5">
                <div className="col-12 col-md">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plant-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M2 9a10 10 0 1 0 20 0" /><path d="M12 19a10 10 0 0 1 10 -10" /><path d="M2 9a10 10 0 0 1 10 10" /><path d="M12 4a9.7 9.7 0 0 1 2.99 7.5" /><path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5" /></svg>
                    </div>
                    <div className="text-center">
                      <h6 className='min-h-auto'>ZARAFET</h6>
                      <p>Estetik ve şıklığın birleşimi.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11l3 3l8 -8" /><path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" /></svg>
                    </div>
                    <div className="text-center">
                      <h6>GÜVEN</h6>
                      <p>Şeffaf süreç, güvenilir hizmet.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-carambola"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17.286 21.09q -1.69 .001 -5.288 -2.615q -3.596 2.617 -5.288 2.616q -2.726 0 -.495 -6.8q -9.389 -6.775 2.135 -6.775h.076q 1.785 -5.516 3.574 -5.516q 1.785 0 3.574 5.516h.076q 11.525 0 2.133 6.774q 2.23 6.802 -.497 6.8" /></svg>
                    </div>
                    <div className="text-center">
                      <h6>ÖZGÜNLÜK</h6>
                      <p>Her tasarımda benzersiz dokunuş.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-leaf"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21c.5 -4.5 2.5 -8 7 -10" /><path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3l.014 0" /></svg>
                    </div>
                    <div className="text-center">
                      <h6>SÜRDÜRÜLEBİLİRLİK</h6>
                      <p>Sorumlu kaynak kullanımı ve çevreye duyarlılık.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md">
                  <div className="about-feature-item">
                    <div className="about-feature-icon text-center mb-3" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-mood-smile-beam"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18" /><path d="M10 10c-.5 -1 -2.5 -1 -3 0" /><path d="M17 10c-.5 -1 -2.5 -1 -3 0" /><path d="M14.5 15a3.5 3.5 0 0 1 -5 0" /></svg>
                    </div>
                    <div className="text-center">
                      <h6>MÜŞTERİ ODAKLILIK</h6>
                      <p>Sizin memnuniyetiniz, en büyük önceliğimizdir.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-us-area">
        <div className="container-fluid" style={{ paddingLeft: 0, backgroundColor: '#F7F4EF' }} >
          <div className="row mx-0">

            <div className="col-lg-4 col-md-3" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <div className="overview-img text-center img-hover_effect whoamiImg">
                <a href="#">
                  <img className="img-full" src="/assets/images/designForYou.png" alt="Hiraola's About Us Image" />
                </a>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 d-flex align-items-center">
              <div className="overview-content ps-md-5">
                {/* <h2>Welcome To <span>Hiraola's</span> Store!</h2> */}
                <h6 className="title-6"> SİZİN İÇİN TASARLIYORUZ </h6>
                <h2>Kişiye özel tasarım <br /> Hayalinizi gerçeğe dönüştürür.</h2>
                <p className="short_desc">
                  Hayalinizdeki takıyı birlikte tasarlıyor, size özel ve anlamlı <br /> parçalara dönüştürüyoruz.
                </p>

                <div className="col-12">
                  <a className="hiraola-btn home-slider-btn" href="#">KİŞİYE ÖZEL TASARIM</a>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-5 d-flex align-items-center justify-content-end">

              <div className="row px-4">
                <div className="col-12">
                  <div className="design-steps">
                    <div className="design-step-item">
                      <span className="step-no">01</span>
                      <div className="step-content">
                        <h6>FİKRİNİZİ DİNLEYELİM</h6>
                        <p>Hayalinizi, ilhamınızı bizimle paylaşın.</p>
                      </div>
                    </div>

                    <div className="design-step-item">
                      <span className="step-no">02</span>
                      <div className="step-content">
                        <h6>TASARLAYALIM</h6>
                        <p>Uzman ekibimizle size özel tasarımınızı oluşturalım.</p>
                      </div>
                    </div>

                    <div className="design-step-item">
                      <span className="step-no">03</span>
                      <div className="step-content">
                        <h6>ÜRETELİM</h6>
                        <p>Usta işçilikle hayalinizdeki takıyı üreterek size ulaştıralım.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>



          </div>
        </div>
      </div>

      <Instagram />

    </>
  )
}

export default AboutUs
