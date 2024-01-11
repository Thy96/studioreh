import { useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  let windowWidth = window.innerWidth;
  const comp = useRef()
  const [toggle, setToggle] = useState(false)
  const [numberHeight, setNumberHeight] = useState(windowWidth)

  const handleToogle = () => {
    setToggle(!toggle)
  }

  useGSAP(() => {

    // text splitting code
    let typeSplit = new SplitType("[split-text]", {
      types: "lines, words, chars",
      tagName: "span"
    })

    // run the code when window width changes
    window.addEventListener("resize", function () {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth
        typeSplit.revert()
      }
    })

    // page load animation
    const homeLoadtl = gsap.timeline()

    const loaderComponent = () => {
      gsap.to('.loader_component', {
        css: {
          display: 'none'
        }
      })
    }

    homeLoadtl.to(".loader_colums", {
      delay: 0.5,
      yPercent: -100,
      duration: 1.6,
      stagger: {
        each: 0.1
      },
      ease: "power4.inOut",
      onComplete: loaderComponent
    }).from(".hero_heading-wrapper .char", {
      yPercent: 100,
      duration: 0.8,
      stagger: {
        amount: 0.5
      },
      ease: "power3.out"
    },
      "-=1"
    ).from(".hero_sub-text-wrap .word", {
      yPercent: 100,
      duration: 1,
      ease: "power2.out"
    },
      "<45%"
    ).from(".hero_background-image-wrap", {
      scale: 1.5,
      ease: "power1.inOut",
      duration: 2.5
    },
      0
    )

    const navMenuComponentOnStart = () => {
      gsap.to('.nav_menu_component', {
        css: {
          display: 'block'
        }
      })
    }

    const navMenuComponentOnReverseComplete = () => {
      gsap.to('.nav_menu_component', {
        css: {
          display: 'none'
        }
      })
    }

    // animations that run on desktop and above
    const desktopAnimation = () => {
      // nav menu animation
      let navMenuTl = gsap.timeline({
        paused: true,
        onStart: navMenuComponentOnStart,
        onReverseComplete: navMenuComponentOnReverseComplete
      });

      navMenuTl
        .from(".nav_menu_link", {
          xPercent: 100,
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          stagger: {
            each: 0.1
          }
        })
        .from(
          ".nav_menu_other-links .text-link_wrap",
          {
            opacity: 0,
            ease: "power2.out",
            yPercent: -40,
            duration: 0.3
          },
          ">-=0.5"
        )
        .from(
          ".nav_menu_close-trigger",
          {
            opacity: 0,
            ease: "power2.out",
            duration: 1.6
          },
          0
        );

      // nav menu icon animtion
      let navMenuIconTl = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.8,
          ease: "power2.inOut"
        }
      });

      navMenuIconTl
        .to(".nav_icon-line:nth-of-type(2)", {
          yPercent: 100
        })
        .to(
          ".nav_icon-line:nth-of-type(1)",
          {
            rotate: 22.5
          },
          0
        )
        .to(
          ".nav_icon-line:nth-of-type(3)",
          {
            rotate: -22.5
          },
          0
        );

      let nav_bar = document.querySelector('.nav_bar')
      nav_bar.addEventListener('click', function () {
        if (!nav_bar.classList.contains('clicked')) {
          navMenuTl.timeScale(1).restart()
          navMenuIconTl.restart();
        } else {
          navMenuTl.timeScale(1.5).reverse();
          navMenuIconTl.reverse();
        }
      })

      let navMenuCloseTrigger = document.querySelector('.nav_menu_close-trigger')
      navMenuCloseTrigger.addEventListener('click', function () {
        navMenuTl.timeScale(1.5).reverse();
        navMenuIconTl.reverse();
      })

      // set progress to 0 on page load
      let navProgressNumber = document.querySelector('.nav_progress-number')
      navProgressNumber.innerText = 0;

      // set scroll progess innerText
      const updateScrollProgress = () => {
        let progress = Math.round(horizontalMainTl.progress() * 100);
        navProgressNumber.innerText = progress;
      }

      const setTrackHeights = () => {
        let trackHeight = document.querySelector('.horizontal-scroll_section-height').clientWidth
        setNumberHeight(trackHeight)
      }

      window.addEventListener("resize", function () {
        setTrackHeights();
      });

      // Add horizontal scroll to the page
      let horizontalMainTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".horizontal-scroll_section-height",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
      horizontalMainTl.to(".horizontal-scroll_track", {
        xPercent: -100,
        ease: "none",
        onUpdate: updateScrollProgress
      });

      // add paralllax to the hero image on scroll
      let heroImageTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section_hero",
          containerAnimation: horizontalMainTl,
          scrub: true,
          start: "left left",
          end: "right left"
        }
      });

      heroImageTl.to(".hero_background-image", {
        x: "30vw",
        ease: "none"
      });

      // change nav state on scroll
      let navStatesTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section_hero",
          toggleActions: "restart none none reverse",
          containerAnimation: horizontalMainTl,
          start: "0.5rem left",
          end: "0.6rem left"
        }
      });

      navStatesTl
        .to(".nav_logo-wrap, .nav_logo-text.is-top", {
          opacity: 0,
          duration: 0.3,
          ease: "power3.out"
        })
        .to(".nav_logo-embed", {
          opacity: 1,
          duration: 0.3,
          ease: "power3.out"
        });

      // horizontal scroll image scales out
      const imagesScalesOut = gsap.utils.toArray('.image-full-cover')
      imagesScalesOut.forEach(el => {
        gsap.from(el, {
          scale: 1.3,
          ease: "power2.out",
          duration: 1,
          scrollTrigger: {
            trigger: el,
            containerAnimation: horizontalMainTl,
            start: "left right",
            end: "right right"
          }
        });
      })

      // add paralllax to the image divider on scroll
      let dividerImageTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".image-divider_wrapper",
          containerAnimation: horizontalMainTl,
          scrub: true,
          start: "left right",
          end: "right left"
        }
      });

      dividerImageTl.from(".image-divider_image", {
        x: "-50%",
        ease: "none"
      });

      // jornal title letter stagger
      let journalTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".jornal_title-wrap",
          containerAnimation: horizontalMainTl,
          start: "left right",
          end: "right right"
        }
      });

      journalTl.from(".jornal_title-wrap .char", {
        yPercent: -120,
        duration: 0.8,
        stagger: {
          amount: 0.4
        },
        ease: "power3.out"
      });
    }

    const mobileAnimation = () => {
      // add paralllax to the hero image on scroll mobile
      let moileHeroImageTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section_hero",
          scrub: true,
          start: "top top",
          end: "bottom top"
        }
      });

      moileHeroImageTl.to(".hero_background-image", {
        y: "15vh",
        ease: "none"
      });

      //scroll image scales out
      const imagesScalesOut = gsap.utils.toArray('.image-full-cover')
      imagesScalesOut.forEach(el => {
        gsap.from(el, {
          scale: 1.5,
          ease: "power2.out",
          duration: 2,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "bottom top"
          }
        })
      })

      // jornal title letter stagger
      let journalTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".jornal_title-wrap",
          start: "top 80%",
          end: "bottom top"
        }
      });

      journalTl.from(".jornal_title-wrap .char", {
        yPercent: -120,
        duration: 0.8,
        stagger: {
          amount: 0.25
        },
        ease: "power3.out"
      });
    }

    let mm = gsap.matchMedia()

    // for animations that should on tablet and above (desktopAnimation)
    mm.add("(min-width: 769px)", () => {
      desktopAnimation();
    });

    // for the animtions that should run of landscape and mobile
    mm.add("(max-width: 768px)", () => {
      mobileAnimation();
    });

  }, { scope: comp })

  return (
    <>
      <div className="page-home" ref={comp}>
        <div className="page-wrapper">
          <div className="loader_component">
            <div className="loader_flex">
              <div className="loader_colums"></div>
              <div className="loader_colums"></div>
              <div className="loader_colums"></div>
            </div>
          </div>
          <div className="nav_compoenent">
            <a href="#A" className="nav_logo-wrap w-inline-block">
              <div className="hero_logo-embed w-embed">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 75 77" fill="none"
                  preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                  <g clipPath="url(#clip0_1_194)">
                    <path
                      d="M32.9269 68.9795H31.7909V76.8173H32.9269V68.9795ZM1.57882 68.8572C1.57882 67.8876 2.43562 67.1284 3.77789 67.1284C4.84098 67.1284 5.79954 67.4764 6.75811 68.2809L7.4375 67.3553C6.38954 66.4903 5.3127 66.0516 3.80677 66.0516C1.84425 66.0516 0.412583 67.2646 0.412583 68.9617C0.412583 70.6588 1.50455 71.5101 3.88103 72.0395C6.05122 72.5099 6.56695 73.071 6.56695 74.0708C6.56695 75.1463 5.65239 75.8903 4.26473 75.8903C2.87708 75.8903 1.80024 75.3897 0.723396 74.3899L0 75.2701C1.23912 76.4074 2.58277 76.9685 4.22073 76.9685C6.27126 76.9685 7.74694 75.7858 7.74694 73.9512C7.74694 72.3132 6.68385 71.4495 4.38301 70.9338C2.10968 70.4332 1.57882 69.8721 1.57882 68.8572ZM10.8097 70.0096H13.2302V68.9782H10.8097V66.6127H9.6737V68.9782H8.61061V70.0096H9.6737V74.7392C9.6737 76.3318 10.6034 76.9534 11.8274 76.9534C12.3734 76.9534 12.8011 76.8324 13.1999 76.6206V75.6194C12.8011 75.8161 12.4765 75.8917 12.0928 75.8917C11.3254 75.8917 10.8083 75.5438 10.8083 74.5879V70.0096H10.8097ZM15.5338 76.4514V73.8384C15.5269 73.7476 15.5228 73.6541 15.5228 73.5579V68.9795H14.3868V73.8467C14.3868 74.9909 14.7939 75.9109 15.5338 76.4528V76.4514ZM19.9209 76.8186H21.0431V68.9809H19.9209V73.4685C19.9209 74.9386 18.9321 75.9247 17.6338 75.9247C17.2666 75.9247 16.9462 75.8546 16.6684 75.7267V76.9286C16.8705 76.9658 17.0837 76.985 17.3092 76.985C18.6226 76.985 19.4038 76.3029 19.9209 75.4544V76.8186ZM25.9817 76.985C26.3104 76.985 26.6102 76.9397 26.8867 76.8599V75.8367C26.6597 75.9027 26.4246 75.9385 26.188 75.9385C24.7412 75.9385 23.5021 74.7557 23.5021 72.8908C23.5021 71.026 24.7124 69.8584 26.188 69.8584C26.4246 69.8584 26.6597 69.8955 26.8867 69.9601V68.9314C26.6102 68.8558 26.309 68.8118 25.9817 68.8118C24.1512 68.8118 22.3359 70.3287 22.3359 72.906C22.3359 75.4832 24.1512 76.9837 25.9817 76.9837V76.985ZM28.9042 76.8173H30.0402V65.749H28.9042V70.48C28.6663 70.1265 28.3761 69.7882 28.0226 69.5104V70.6189C28.5783 71.1525 28.9482 71.9364 28.9482 72.8908C28.9482 73.8453 28.5769 74.6402 28.0226 75.1752V76.2493C28.3692 75.9618 28.6594 75.6111 28.9042 75.2398V76.8159V76.8173ZM31.718 67.266H33.0163V65.9773H31.718V67.266ZM37.105 76.7884V75.6125C36.1945 75.105 35.599 74.0805 35.599 72.8908C35.599 71.7012 36.1767 70.6519 37.105 70.1582V69.0346C35.5042 69.5915 34.4328 71.1442 34.4328 72.9211C34.4328 74.698 35.5042 76.2451 37.105 76.7884ZM42.3888 72.8908C42.3888 70.6615 40.7055 68.8118 38.4184 68.8118C38.3579 68.8118 38.3001 68.8186 38.241 68.8214V69.8515C38.2905 69.8487 38.3386 69.8432 38.3881 69.8432C39.9972 69.8432 41.2226 71.2075 41.2226 72.9211C41.2226 74.6347 40.0701 75.9536 38.4184 75.9536C38.3579 75.9536 38.3001 75.9481 38.241 75.944V76.9919C38.2905 76.9947 38.3386 77.0002 38.3881 77.0002C40.6903 77.0002 42.3874 75.1202 42.3874 72.8922L42.3888 72.8908ZM47.7262 72.6942H48.4565V71.6187H47.7262V67.3127H48.4565V66.2056H46.56V76.8186H47.7262V72.6942ZM54.7938 76.8186L51.621 72.4824C53.2439 72.1798 54.4252 71.1484 54.4252 69.3743C54.4252 67.464 52.9647 66.2056 50.6913 66.2056H49.5925V67.3127H50.6019C52.2688 67.3127 53.2438 68.1007 53.2438 69.421C53.2438 70.7413 52.1368 71.6201 50.5868 71.6201H49.5925V72.6955H50.3668L53.3621 76.82H54.7938V76.8186ZM57.5388 72.0423V70.9201V66.2042H56.3726V76.8173H57.5388V72.0409V72.0423ZM63.502 76.8186H64.6683V66.2056H63.502V70.9214H58.6748V72.0437H63.502V76.82V76.8186ZM67.83 75.7267V72.012H73.4673V70.9201H67.83V67.2962H74.1329V66.2042H66.6652V76.8173H74.2072V75.7253H67.8314L67.83 75.7267Z"
                      fill="currentColor" />
                    <path
                      d="M49.0568 45.5014H56.8936V56.8765H49.0568V45.5014ZM43.4599 38.6767H56.8936V44.3642H47.9369V56.8778H43.4585V38.6767H43.4599ZM37.8616 29.5761H56.8936V37.5381H42.34V56.8765H37.8616V29.5761ZM27.7852 17.0639H56.8936V28.4376H36.7417V56.8765H27.7852V17.0639ZM16.59 1.13723H56.8936V15.9253H26.6651V56.8765H16.59V1.13723ZM15.4701 58.0137H58.0121V0H15.4688V58.0137H15.4701Z"
                      fill="currentColor" />
                    <path
                      d="M32.9269 68.9795H31.7909V76.8173H32.9269V68.9795ZM1.57882 68.8572C1.57882 67.8876 2.43562 67.1284 3.77789 67.1284C4.84098 67.1284 5.79954 67.4764 6.75811 68.2809L7.4375 67.3553C6.38954 66.4903 5.3127 66.0516 3.80677 66.0516C1.84425 66.0516 0.412583 67.2646 0.412583 68.9617C0.412583 70.6588 1.50455 71.5101 3.88103 72.0395C6.05122 72.5099 6.56695 73.071 6.56695 74.0708C6.56695 75.1463 5.65239 75.8903 4.26473 75.8903C2.87708 75.8903 1.80024 75.3897 0.723396 74.3899L0 75.2701C1.23912 76.4074 2.58277 76.9685 4.22073 76.9685C6.27126 76.9685 7.74694 75.7858 7.74694 73.9512C7.74694 72.3132 6.68385 71.4495 4.38301 70.9338C2.10968 70.4332 1.57882 69.8721 1.57882 68.8572ZM10.8097 70.0096H13.2302V68.9782H10.8097V66.6127H9.6737V68.9782H8.61061V70.0096H9.6737V74.7392C9.6737 76.3318 10.6034 76.9534 11.8274 76.9534C12.3734 76.9534 12.8011 76.8324 13.1999 76.6206V75.6194C12.8011 75.8161 12.4765 75.8917 12.0928 75.8917C11.3254 75.8917 10.8083 75.5438 10.8083 74.5879V70.0096H10.8097ZM15.5338 76.4514V73.8384C15.5269 73.7476 15.5228 73.6541 15.5228 73.5579V68.9795H14.3868V73.8467C14.3868 74.9909 14.7939 75.9109 15.5338 76.4528V76.4514ZM19.9209 76.8186H21.0431V68.9809H19.9209V73.4685C19.9209 74.9386 18.9321 75.9247 17.6338 75.9247C17.2666 75.9247 16.9462 75.8546 16.6684 75.7267V76.9286C16.8705 76.9658 17.0837 76.985 17.3092 76.985C18.6226 76.985 19.4038 76.3029 19.9209 75.4544V76.8186ZM25.9817 76.985C26.3104 76.985 26.6102 76.9397 26.8867 76.8599V75.8367C26.6597 75.9027 26.4246 75.9385 26.188 75.9385C24.7412 75.9385 23.5021 74.7557 23.5021 72.8908C23.5021 71.026 24.7124 69.8584 26.188 69.8584C26.4246 69.8584 26.6597 69.8955 26.8867 69.9601V68.9314C26.6102 68.8558 26.309 68.8118 25.9817 68.8118C24.1512 68.8118 22.3359 70.3287 22.3359 72.906C22.3359 75.4832 24.1512 76.9837 25.9817 76.9837V76.985ZM28.9042 76.8173H30.0402V65.749H28.9042V70.48C28.6663 70.1265 28.3761 69.7882 28.0226 69.5104V70.6189C28.5783 71.1525 28.9482 71.9364 28.9482 72.8908C28.9482 73.8453 28.5769 74.6402 28.0226 75.1752V76.2493C28.3692 75.9618 28.6594 75.6111 28.9042 75.2398V76.8159V76.8173ZM31.718 67.266H33.0163V65.9773H31.718V67.266ZM37.105 76.7884V75.6125C36.1945 75.105 35.599 74.0805 35.599 72.8908C35.599 71.7012 36.1767 70.6519 37.105 70.1582V69.0346C35.5042 69.5915 34.4328 71.1442 34.4328 72.9211C34.4328 74.698 35.5042 76.2451 37.105 76.7884ZM42.3888 72.8908C42.3888 70.6615 40.7055 68.8118 38.4184 68.8118C38.3579 68.8118 38.3001 68.8186 38.241 68.8214V69.8515C38.2905 69.8487 38.3386 69.8432 38.3881 69.8432C39.9972 69.8432 41.2226 71.2075 41.2226 72.9211C41.2226 74.6347 40.0701 75.9536 38.4184 75.9536C38.3579 75.9536 38.3001 75.9481 38.241 75.944V76.9919C38.2905 76.9947 38.3386 77.0002 38.3881 77.0002C40.6903 77.0002 42.3874 75.1202 42.3874 72.8922L42.3888 72.8908ZM47.7262 72.6942H48.4565V71.6187H47.7262V67.3127H48.4565V66.2056H46.56V76.8186H47.7262V72.6942ZM54.7938 76.8186L51.621 72.4824C53.2439 72.1798 54.4252 71.1484 54.4252 69.3743C54.4252 67.464 52.9647 66.2056 50.6913 66.2056H49.5925V67.3127H50.6019C52.2688 67.3127 53.2438 68.1007 53.2438 69.421C53.2438 70.7413 52.1368 71.6201 50.5868 71.6201H49.5925V72.6955H50.3668L53.3621 76.82H54.7938V76.8186ZM57.5388 72.0423V70.9201V66.2042H56.3726V76.8173H57.5388V72.0409V72.0423ZM63.502 76.8186H64.6683V66.2056H63.502V70.9214H58.6748V72.0437H63.502V76.82V76.8186ZM67.83 75.7267V72.012H73.4673V70.9201H67.83V67.2962H74.1329V66.2042H66.6652V76.8173H74.2072V75.7253H67.8314L67.83 75.7267Z"
                      fill="currentColor" />
                    <path
                      d="M49.0568 45.5014H56.8936V56.8765H49.0568V45.5014ZM43.4599 38.6767H56.8936V44.3642H47.9369V56.8778H43.4585V38.6767H43.4599ZM37.8616 29.5761H56.8936V37.5381H42.34V56.8765H37.8616V29.5761ZM27.7852 17.0639H56.8936V28.4376H36.7417V56.8765H27.7852V17.0639ZM16.59 1.13723H56.8936V15.9253H26.6651V56.8765H16.59V1.13723ZM15.4701 58.0137H58.0121V0H15.4688V58.0137H15.4701Z"
                      fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_194">
                      <rect width="75" height="77" fill="currentColor" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>
            <div className={toggle === true ? 'nav_bar clicked' : 'nav_bar'} onClick={handleToogle}>
              <div className="nav_top-logo">
                <div className="nav_logo-embed w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="100%"
                  height="100%" viewBox="0 0 16 100" fill="none" preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true" role="img">
                  <path
                    d="M4.594 55.6284V57.1593H15.7399V55.6284H4.594ZM4.42008 97.8724C3.04124 97.8724 1.96161 96.7178 1.96161 94.909C1.96161 93.4764 2.45648 92.1847 3.60054 90.8929L2.28427 89.9774C1.05418 91.3896 0.430314 92.8407 0.430314 94.8701C0.430314 97.5147 2.15529 99.444 4.56869 99.444C6.98208 99.444 8.19269 97.9725 8.94553 94.77C9.61447 91.8455 10.4124 91.1505 11.8342 91.1505C13.3636 91.1505 14.4216 92.383 14.4216 94.2529C14.4216 96.1229 13.7098 97.574 12.288 99.0252L13.5397 100C15.157 98.3302 15.9549 96.5195 15.9549 94.3122C15.9549 91.549 14.273 89.5604 11.6641 89.5604C9.33476 89.5604 8.10651 90.993 7.37315 94.0936C6.66126 97.157 5.86334 97.8724 4.42008 97.8724ZM6.05887 85.4331V82.1713H4.59215V85.4331H1.22824V86.9639H4.59215V88.3965H6.05887V86.9639H12.7847C15.0495 86.9639 15.9334 85.7111 15.9334 84.0617C15.9334 83.3259 15.7614 82.7495 15.4602 82.2121H14.0364C14.3161 82.7495 14.4236 83.1869 14.4236 83.704C14.4236 84.7381 13.9289 85.435 12.5695 85.435H6.05887V85.4331ZM15.2196 79.067H11.5037C11.3746 79.0763 11.2416 79.0818 11.1048 79.0818H4.594V80.6127H11.5155C13.1426 80.6127 14.4509 80.0641 15.2216 79.067H15.2196ZM15.7418 73.155V71.6428H4.596L4.596 73.155H10.9777C13.0683 73.155 14.4706 74.4875 14.4706 76.2371C14.4706 76.7319 14.3709 77.1637 14.189 77.538H15.8982C15.9511 77.2657 15.9784 76.9784 15.9784 76.6745C15.9784 74.9046 15.0084 73.8519 13.8018 73.155H15.7418ZM15.9784 64.9876C15.9784 64.5447 15.914 64.1407 15.8005 63.7681H14.3454C14.4393 64.074 14.4902 64.3908 14.4902 64.7096C14.4902 66.6593 12.8082 68.3291 10.1561 68.3291C7.50427 68.3291 5.84385 66.6981 5.84385 64.7096C5.84385 64.3908 5.89661 64.074 5.98848 63.7681H4.52559C4.41808 64.1407 4.35552 64.5466 4.35552 64.9876C4.35552 67.4544 6.51265 69.9006 10.1778 69.9006C13.8427 69.9006 15.9765 67.4544 15.9765 64.9876H15.9784ZM15.7399 61.0493V59.5185H0L0 61.0493H6.72782C6.22512 61.3699 5.74403 61.761 5.34897 62.2374H6.92534C7.68415 61.4885 8.79892 60.99 10.1561 60.99C11.5135 60.99 12.6439 61.4904 13.4047 62.2374H14.9322C14.5233 61.7703 14.0246 61.3792 13.4966 61.0493H15.7379H15.7399ZM2.15728 57.2575V55.508H0.324662L0.324662 57.2575H2.15728ZM15.6988 49.9981H14.0266C13.3049 51.2251 11.848 52.0276 10.1561 52.0276C8.46445 52.0276 6.97227 51.2491 6.2702 49.9981H4.67235C5.46431 52.1553 7.67235 53.5991 10.1992 53.5991C12.7261 53.5991 14.9262 52.1553 15.6988 49.9981ZM10.1561 42.8778C6.98592 42.8778 4.35552 45.1462 4.35552 48.2282C4.35552 48.3097 4.36519 48.3876 4.36917 48.4673H5.83405C5.83007 48.4006 5.82224 48.3357 5.82224 48.269C5.82224 46.1006 7.76237 44.4493 10.1992 44.4493C12.6361 44.4493 14.5117 46.0024 14.5117 48.2282C14.5117 48.3097 14.5038 48.3876 14.498 48.4673H15.9882C15.9922 48.4006 16 48.3357 16 48.269C16 45.1666 13.3265 42.8797 10.1581 42.8797L10.1561 42.8778ZM9.87656 35.6852V34.7011H8.34713V35.6852H2.22369V34.7011H0.649312L0.649312 37.2568H15.7418V35.6852H9.87656ZM15.7418 26.1611L9.57537 30.4367C9.14505 28.2497 7.67833 26.6578 5.15543 26.6578C2.43885 26.6578 0.649312 28.6259 0.649312 31.6895L0.649312 33.1702H2.22369V31.81C2.22369 29.5637 3.34428 28.2498 5.22184 28.2498C7.0994 28.2498 8.34912 29.7416 8.34912 31.8303V33.1702H9.87842V32.1268L15.7437 28.0904V26.1611H15.7418ZM8.94951 22.462H7.35367H0.647327L0.647327 24.0335H15.7399V22.462H8.94753H8.94951ZM15.7418 14.4261V12.8544H0.649312L0.649312 14.4261H7.35552L7.35552 20.9311H8.95151V14.4261H15.7437H15.7418ZM14.189 8.59377H8.90643L8.90643 0.99707H7.35367V8.59377H2.20023L2.20023 0.100128H0.647327L0.647327 10.1634H15.7399L15.7399 0H14.187L14.187 8.59189L14.189 8.59377Z"
                    fill="currentColor" />
                </svg></div>
                <div className="nav_logo-text is-top">Est. 1997</div>
              </div>
              <div className="nav_trigger">
                <div className="nav_icon">
                  <div className="nav_icon-line"></div>
                  <div className="nav_icon-line"></div>
                  <div className="nav_icon-line"></div>
                </div>
              </div>
              <div className="nav_bottom-progress">
                <div className="nav_logo-text is-bottom"><span className="nav_progress-number">0</span>%</div>
              </div>
            </div>
            <div className="nav_menu_component">
              <div className="nav_menu_close-trigger"></div>
              <div className="nav_menu_wrap">
                <div className="nav_menu_list"><a href="#A" className="nav_menu_link w-inline-block">
                  <div>Contact</div>
                </a><a href="#A" className="nav_menu_link is-75 w-inline-block">
                    <div>Journal</div>
                  </a><a href="#A" className="nav_menu_link is-50 w-inline-block">
                    <div>Projects</div>
                  </a><a href="#A" className="nav_menu_link is-25 w-inline-block">
                    <div>About</div>
                  </a></div>
                <div className="nav_menu_other-links"><a href="#A" className="text-link_wrap w-inline-block">
                  <div>Privacy Policy</div>
                  <div className="text-link_line"></div>
                </a><a href="https://www.thethunderclap.com/" target="_blank" rel="noreferrer"
                  className="text-link_wrap w-inline-block">
                    <div>Site By ThunderClap</div>
                    <div className="text-link_line"></div>
                  </a></div>
              </div>
            </div>
          </div>
          <main className="main-wrapper">
            <div className="horizontal-scroll_section-wrapper">
              <div className="horizontal-scroll_section-height" style={{ height: numberHeight }}>
                <div className="horizontal-scroll_stickey-element">
                  <div className="horizontal-scroll_track">
                    <div className="horizontal-scroll_track-list">
                      <section className="section_hero">
                        <div className="hero_content">
                          <div className="padding-section-medium is-hero">
                            <div className="padding-global">
                              <div className="hero_content-wrapper">
                                <div className="hero_heading-wrapper">
                                  <h1 split-text="true" className="hero_heading split-text">Building Beyond</h1>
                                </div>
                                <div className="hero_sub-text-wrap">
                                  <h2 split-text="true" className="heading-style-h3 is-hero">We are a
                                    London based architecture and design studio with global
                                    reputation for creating innovative spaces.</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hero_background-image-wrap"><img
                          src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e31f2ece4592ec1e01d62d_1665158307-studio-rhe-hero.jpg"
                          loading="lazy" alt="" className="hero_background-image" /></div>
                      </section>
                      <section className="section_intro">
                        <div className="padding-section-medium">
                          <div className="padding-global">
                            <div className="intro_content-parent">
                              <div className="intro_top">
                                <div className="intro_title-wrap">
                                  <h2 className="test-size-title-small">Introduction</h2>
                                </div>
                                <figure className="intro_image-wrap">
                                  <div className="intro_image-proportions"><img
                                    src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e32456bf509097c9abe3bc_1657797867-aerial-3-copy.webp"
                                    loading="eager" alt="" className="image-full-cover" /></div>
                                </figure>
                              </div>
                              <div className="intro_content">
                                <h3>Established 1997</h3>
                                <p>We are an architectural studio that believes in going further.
                                  Being bold. Exploring the new. Where the surprising delights the
                                  mind. Where people love to live, work and play. Let’s start
                                  building beyond.</p><a href="#A"
                                    className="text-link_wrap w-inline-block">
                                  <div>Learn more about us</div>
                                  <div className="text-link_line"></div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="section_line-seprator"></div>
                      </section>
                      <section className="section_work">
                        <div className="padding-section-medium">
                          <div className="padding-global">
                            <div className="work_list">
                              <article className="work_card">
                                <figure className="work_card-image-wrap"><img
                                  src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e32c34c09f94c51fac47f4_1665559885-zil-pasyon-r1_1-2.webp"
                                  loading="eager" alt="" className="image-full-cover" /></figure>
                                <div className="work_card-content">
                                  <h2 className="test-size-title-small">Zil Residences</h2>
                                  <div className="text-link_wrap">
                                    <div>View Project</div>
                                    <div className="text-link_line"></div>
                                  </div>
                                </div>
                              </article>
                              <article className="work_card">
                                <figure className="work_card-image-wrap"><img
                                  src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e32c7df8a9a1821c45318e_1659949646-studio-rhe_zil-pasyon-island-1-1-1.jpg"
                                  loading="eager" alt="" className="image-full-cover" /></figure>
                                <div className="work_card-content">
                                  <h2 className="test-size-title-small">Zil Resort</h2>
                                  <div className="text-link_wrap">
                                    <div>View Project</div>
                                    <div className="text-link_line"></div>
                                  </div>
                                </div>
                              </article>
                              <article className="work_card">
                                <figure className="work_card-image-wrap"><img
                                  src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e32ca1b53b91968492f16c_1665999727-dl-rhe-gb-0977-online.jpg"
                                  loading="eager" alt="" className="image-full-cover" /></figure>
                                <div className="work_card-content">
                                  <h2 className="test-size-title-small">Zil Residences</h2>
                                  <div className="text-link_wrap">
                                    <div>View Project</div>
                                    <div className="text-link_line"></div>
                                  </div>
                                </div>
                              </article>
                            </div>
                          </div>
                        </div>
                        <div className="section_line-seprator"></div>
                      </section>
                      <section className="section_cta">
                        <div className="padding-section-medium">
                          <div className="padding-global">
                            <div className="cta_content">
                              <h2 className="test-size-title-small">Introduction</h2>
                              <div className="cta_quorte">
                                <div className="cta_title-wrap">
                                  <h3 className="cta_quorte-title">Collaborating to create the
                                    surprising with innovation that inspires. Let’s work towards
                                    something bigger and brighter.</h3>
                                </div>
                                <div className="cta_quorte-subtext">
                                  <div>Focusing on </div>
                                  <div className="text-link_wrap is-proportion">
                                    <div>Commercial</div>
                                    <div className="text-link_line"></div>
                                  </div>
                                  <div> &amp; </div>
                                  <div className="text-link_wrap is-proportion">
                                    <div>Resort</div>
                                    <div className="text-link_line"></div>
                                  </div>
                                  <div> Projects</div>
                                </div>
                              </div>
                              <div className="text-link_wrap">
                                <div>View Project</div>
                                <div className="text-link_line"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <section className="section_image-divider">
                        <div className="image-divider_wrapper">
                          <div className="image-divider_image-wrap"><img
                            src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e33256bb6ec63134017d86_1660813591-home-image.webp"
                            loading="eager" alt="" className="image-divider_image" /></div>
                        </div>
                      </section>
                      <section className="section_jornal">
                        <div className="padding-section-medium">
                          <div className="padding-global">
                            <div className="jornal_content">
                              <div className="jornal_title-wrap">
                                <h2 split-text="true" className="heading-style-h1">Journal </h2>
                                <h2 className="heading-style-h1"> </h2>
                              </div>
                              <div className="jornal_content-wrap">
                                <h3 className="jornal_subtext">In tune with London&#x27;s fast changing
                                  markets, Studio RHE combine commercial know how with creative
                                  originality.</h3><a href="#A"
                                    className="text-link_wrap is-proportion w-inline-block">
                                  <div>Learn more about us</div>
                                  <div className="text-link_line is-white"></div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <section className="section_articles">
                        <div className="padding-section-medium">
                          <div className="padding-global">
                            <div className="articles_list">
                              <div id="w-node-_8ecf5da8-af76-7225-f4e4-4b4c9ca0b787-fa21f8a0"
                                className="articles_colum">
                                <article className="article_card">
                                  <figure className="article_card-image-wrap"><img
                                    src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e3461ad2b49f6b1e233d6b_1674045545-1-bermondsey-1-copy.jpg"
                                    loading="eager" alt="" className="image-full-cover" />
                                  </figure>
                                  <div className="article_card-content">
                                    <h2 className="test-size-title-small">Zil Residences</h2>
                                    <div className="text-link_wrap">
                                      <div>View Project</div>
                                      <div className="text-link_line"></div>
                                    </div>
                                  </div>
                                </article>
                              </div>
                              <div id="w-node-c1cc412d-d92d-8b61-7f97-2a7f2e5e2462-fa21f8a0"
                                className="articles_colum is-2nd">
                                <article className="article_card">
                                  <figure className="article_card-image-wrap"><img
                                    src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e3463edc75826a9cf491f4_1663877324-dl-rhe-ts-1388-print.webp"
                                    loading="eager" alt="" className="image-full-cover" />
                                  </figure>
                                  <div className="article_card-content">
                                    <h2 className="test-size-title-small">Zil Residences</h2>
                                    <div className="text-link_wrap">
                                      <div>View Project</div>
                                      <div className="text-link_line"></div>
                                    </div>
                                  </div>
                                </article>
                                <article className="article_card">
                                  <figure className="article_card-image-wrap"><img
                                    src="https://assets.website-files.com/64e3117c2169dbd1fa21f870/64e3465edc75826a9cf4c2d3_1686739600-72f544af-bf04-4de3-9c99-3c3f747e9737.webp"
                                    loading="eager" alt="" className="image-full-cover" />
                                  </figure>
                                  <div className="article_card-content">
                                    <h2 className="test-size-title-small">Zil Residences</h2>
                                    <div className="text-link_wrap">
                                      <div>View Project</div>
                                      <div className="text-link_line"></div>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
