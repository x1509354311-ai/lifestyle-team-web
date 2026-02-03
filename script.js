// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
    
    // --- 0. 全局初始化 ---
    // 隐藏所有待动画元素，防止闪烁
    gsap.set(".gsap-fade-up, .gsap-fade-in-s2, .gsap-init-hidden, .gsap-grid-item, .gsap-member, .gsap-box, .stat-bar-fill", { opacity: 0 });

    // --- P1: 封面入场 (Cover) ---
    const p1Tl = gsap.timeline();
    p1Tl.fromTo(".cover-title-cn", 
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
        )
        .fromTo(".cover-line", 
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1, ease: "power2.out" }, 
            "-=0.8"
        )
        .fromTo(".cover-logo", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, onComplete: () => document.querySelector('.cover-logo').classList.add('visible') },
            "-=0.5"
        );
    
    // 背景缓慢缩放
    gsap.to(".section-cover .bg-media", {
        scale: 1.1, duration: 20, ease: "none", repeat: -1, yoyo: true
    });

    // --- P2: 简介入场 (Credentials) ---
    gsap.fromTo(".gsap-fade-in-s2", 
        { y: 40, opacity: 0 },
        {
            scrollTrigger: { trigger: "#slide-2", start: "top 60%" },
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out"
        }
    );
    // 右侧图片视差
    gsap.fromTo(".section-credentials .fg-media", 
        { x: 50, scale: 1.1 },
        {
            scrollTrigger: { trigger: "#slide-2", start: "top bottom", end: "bottom top", scrub: 1 },
            x: 0, scale: 1, ease: "none"
        }
    );

    // --- P3: 生态图入场 (Solutions) - 仅在 PC 端运行复杂动画 ---
    if (window.innerWidth > 1200) {
        const p3Tl = gsap.timeline({
            scrollTrigger: { trigger: "#slide-3", start: "top 70%", toggleActions: "play none none reverse" }
        });
        
        p3Tl.to("#anim-core", { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
            .to("#anim-toc", { opacity: 1, x: 0, duration: 0.6 }, "-=0.4")
            .to("#anim-tob", { opacity: 1, x: 0, duration: 0.6 }, "-=0.5")
            .to("#anim-dock", { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
            .to(".sat-node", { scale: 1, opacity: 1, stagger: 0.2, ease: "back.out(1.5)" }, "-=0.3")
            .to(".conn-line", { opacity: 1, stagger: 0.1 }, "-=0.5")
            .to("#anim-text", { x: 0, opacity: 1, duration: 0.8 }, "-=0.8");
    } else {
        // 手机端直接显示，不做复杂动画防止乱序
        gsap.set(".gsap-init-hidden", { opacity: 1, scale: 1, x: 0, y: 0 });
    }

// --- P4: 客户墙入场 (Clients) ---
gsap.fromTo(".gsap-grid-item", 
    { 
        scale: 0.9,       // 稍微缩小一点，不用缩太小，保持质感
        opacity: 0, 
        filter: "blur(5px)" // 增加一点模糊进场，更高级
    },
    {
        scrollTrigger: { 
            trigger: "#slide-4", 
            start: "top 60%" // 当卷轴滚到视口 60% 处触发，比之前更早一点，防止用户划太快
        },
        scale: 1, 
        opacity: 1, 
        filter: "blur(0px)",
        duration: 0.5, 
        // 关键修改：直接设置 0.2，代表严格的 1->2->3...->9 顺序，每个间隔 0.2秒
        stagger: 0.2, 
        ease: "power2.out"
    }
);

    // --- P5: 团队入场 (Team) ---
    const t5 = gsap.timeline({
        scrollTrigger: { trigger: "#slide-5", start: "top 60%" }
    });

    t5.fromTo(".section-header", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(".gsap-member", 
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)" }, 
          "-=0.4"
      )
      .fromTo(".gsap-box", 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 
          "-=0.6"
      );

    // 数据条增长动画
    gsap.utils.toArray(".stat-box").forEach(box => {
        const bar = box.querySelector(".stat-bar-fill");
        const width = box.getAttribute("data-width");
        gsap.to(bar, {
            scrollTrigger: { trigger: box, start: "top 85%" },
            width: width, opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 0.2
        });
    });

    // S3 响应式缩放计算 (保持 16:9 比例)
    function resizeStage() {
        const stage = document.querySelector('.sol-stage-wrapper');
        if(window.innerWidth > 1200 && stage) {
            // 计算缩放比：屏幕宽/基准宽 (1600)
            const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
            stage.style.transform = `scale(${scale * 0.9})`; 
        } else if (stage) {
            stage.style.transform = 'none';
        }
    }
    window.addEventListener('resize', resizeStage);
    resizeStage();
    // --- P6: 矩阵交互 (Strategy Matrix) ---
    const matrixContainer = document.getElementById('matrixContainer');
    const mouseGlow = document.getElementById('mouseGlow');
    if(matrixContainer && mouseGlow) {
        matrixContainer.addEventListener('mousemove', (e) => {
            const rect = matrixContainer.getBoundingClientRect();
            mouseGlow.style.opacity = '1';
            mouseGlow.style.left = (e.clientX - rect.left) + 'px';
            mouseGlow.style.top = (e.clientY - rect.top) + 'px';
        });
        matrixContainer.addEventListener('mouseleave', () => {
            mouseGlow.style.opacity = '0';
        });
    }

    // --- P6: 动画 ---
    const t6 = gsap.timeline({ scrollTrigger: { trigger: "#slide-6", start: "top 60%" }});
    t6.to(".section-strategy .strategy-container", { opacity: 1, duration: 1 })
      .to(".section-strategy .gsap-fade", { opacity: 1, y: 0, stagger: 0.2 }, "-=0.5")
      .from(".axis-line-x", { scaleX: 0, duration: 0.8 }, "-=0.5")
      .from(".axis-line-y", { scaleY: 0, duration: 0.8 }, "<")
      .to(".section-strategy .gsap-scale", { opacity: 1, scale: 1, stagger: { amount: 0.6, from: "center" }, ease: "back.out(1.5)" }, "-=0.3");

    // --- P7: 动画 ---
    const t7 = gsap.timeline({ scrollTrigger: { trigger: "#slide-7", start: "top 60%" }});
    t7.to(".section-ltv .page-super-title", { opacity: 1, x: 0 })
      .to(".section-ltv .gsap-left", { opacity: 1, x: 0 }, "-=0.4")
      .to(".section-ltv .gsap-mid", { opacity: 1, scale: 1 }, "-=0.4")
      .to(".section-ltv .gsap-right-row", { opacity: 1, x: 0, stagger: 0.2 }, "-=0.2")
      .to(".section-ltv .gsap-footer", { opacity: 1, y: 0 }, "-=0.2");

    // --- P8: 动画 & 交互 ---
    const t8 = gsap.timeline({ scrollTrigger: { trigger: "#slide-8", start: "top 60%" }});
    t8.to(".section-channel .page-super-title", { opacity: 1, x: 0 })
      .to(".section-channel .gsap-fade", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.4");

    // P8 时间轴交互逻辑
    const months = document.querySelectorAll('.m-item');
    const nodes = document.querySelectorAll('.node-box');
    const container = document.querySelector('.tl-axis-container');
    
    // 映射表：月份索引 -> 场景ID索引
    const sceneMapping = {
        0:0, 1:0,          // Jan, Feb -> Scene 0
        2:1, 3:1, 4:1,     // Mar-May -> Scene 1
        5:2, 6:2,          // Jun, Jul -> Scene 2
        7:3, 8:3, 9:3,     // Aug-Oct -> Scene 3
        10:4, 11:4         // Nov, Dec -> Scene 4
    };

    if(container) {
        months.forEach(month => {
            month.addEventListener('mouseenter', () => {
                const idx = parseInt(month.getAttribute('data-idx'));
                container.classList.add('focus-mode');
                month.classList.add('active');
                if(nodes[idx]) nodes[idx].classList.add('highlight');
                const sceneIdx = sceneMapping[idx];
                const targetScene = document.getElementById(`scene-${sceneIdx}`);
                if(targetScene) targetScene.classList.add('highlight');
            });
            month.addEventListener('mouseleave', () => {
                container.classList.remove('focus-mode');
                months.forEach(m => m.classList.remove('active'));
                nodes.forEach(n => n.classList.remove('highlight'));
                document.querySelectorAll('.scene-box').forEach(s => s.classList.remove('highlight'));
            });
        });
    }

    // --- Slide 9: Visual Transition ---
    const t9 = gsap.timeline({ scrollTrigger: { trigger: "#slide-9", start: "top 60%", toggleActions: "play none none reverse" }});
    t9.to(".light-beam", { duration: 1.2, scaleX: 1, opacity: 1, ease: "expo.out" })
      .to(".light-beam", { duration: 0.8, opacity: 0, ease: "power2.in" }, "-=0.4")
      .to(".showcase-text", { duration: 2, opacity: 1, scale: 1, ease: "power4.out", filter: "blur(0px)" }, "-=1.0");

    // --- Slide 10: BMW Hub ---
    gsap.to("#slide-10 .bg-media", { scale: 1.05, duration: 10, ease: "none", scrollTrigger: { trigger: "#slide-10", start: "top bottom", toggleActions: "play none none reverse" }});
    const t10 = gsap.timeline({ scrollTrigger: { trigger: "#slide-10", start: "top 60%" }});
    t10.to(".gsap-header-10", { duration: 1, opacity: 1, y: 0 })
       .to(".gsap-label-10", { duration: 0.6, opacity: 1, filter: "blur(0px)", stagger: 0.2 }, "-=0.5");

    // --- Slide 11: Lifestyle Spot ---
    gsap.fromTo("#slide-11 .p10-visual-root", { scale: 1.1 }, { scale: 1, duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: "#slide-11", start: "top 70%" }});
    gsap.to(".gsap-p10-video", { opacity: 1, duration: 1, delay: 0.5, scrollTrigger: { trigger: "#slide-11", start: "top 60%" }});
    const t11 = gsap.timeline({ scrollTrigger: { trigger: "#slide-11", start: "top 60%" }});
    t11.to(".gsap-p10-header", { duration: 1, opacity: 1, y: 0 })
       .to(".gsap-p10-label", { duration: 0.6, opacity: 1, filter: "blur(0px)", stagger: 0.3 }, "-=0.5");

    // --- Slide 12: Scenario Mirror (Right Side) ---
    gsap.to(".p12-bg-img", { scale: 1, scrollTrigger: { trigger: "#slide-12", start: "top bottom", end: "bottom top", scrub: 1.5 }});
    
    const t12 = gsap.timeline({ scrollTrigger: { trigger: "#slide-12", start: "top 60%" }});
    
    t12.to(".gsap-p12-text", { duration: 1, opacity: 1, x: 0 })
       .to(".gsap-p12-phone", { 
           duration: 1.4, 
           opacity: 1, 
           // 纯粹的淡入和位移，不改变 transform 核心布局
           y: 0, 
           scale: 1, 
           ease: "power4.out",
           onStart: () => {
               // 初始状态：向下偏移 150px (y: 150)，保持垂直居中 (yPercent: -50)
               gsap.set(".p12-phone-container", { y: 150, yPercent: -50, scale: 0.95 });
           }
       }, "-=0.8")
       .to(".p12-deco-line", { height: "70%", duration: 1.5 }, "-=1.0");

    // --- Slide 13: Center Mirror (Center) ---
    gsap.to(".p13-bg-img", { scale: 1, scrollTrigger: { trigger: "#slide-13", start: "top bottom", end: "bottom top", scrub: 1.5 }});
    
    const t13 = gsap.timeline({ scrollTrigger: { trigger: "#slide-13", start: "top 60%" }});
    
    t13.to(".gsap-p13-text", { duration: 1, opacity: 1, x: 0 })
       .to(".gsap-p13-phone", { 
           duration: 1.4, 
           opacity: 1, 
           // 确保 x/yPercent 始终居中 (-50%)
           y: 0, 
           scale: 1, 
           ease: "power4.out",
           onStart: () => {
               // 初始状态：双向居中 (x/yPercent: -50)，并向下偏移 150px
               gsap.set(".p13-phone-container", { xPercent: -50, yPercent: -50, y: 150, scale: 0.95 });
           }
       }, "-=0.8");

    // --- Slide 14: Sample Area ---
    const t14 = gsap.timeline({ scrollTrigger: { trigger: "#slide-14", start: "top 60%" }});
    t14.to(".gsap-fade-up-14", { duration: 1, opacity: 1, y: 0, stagger: 0.2 })
       .to(".gsap-scale-in-14", { duration: 1.2, opacity: 1, scale: 1 }, "-=0.8")
       .to(".gsap-fade-in-14", { duration: 0.8, opacity: 1 }, "-=0.6");

    // --- Slide 15: Omnichannel ---
    const t15 = gsap.timeline({ scrollTrigger: { trigger: "#slide-15", start: "top 60%" }});
    t15.to(".gsap-header-in-15", { duration: 1, opacity: 1, y: 0 })
       .to(".gsap-fade-up-15", { duration: 0.8, opacity: 1, y: 0, stagger: 0.15, onComplete: () => {
           document.querySelectorAll('.rolling-num').forEach(num => {
               const target = parseInt(num.getAttribute('data-target'));
               gsap.to({ val: 0 }, { val: target, duration: 2, ease: "power2.out", onUpdate: function() { num.innerText = Math.floor(this.targets()[0].val).toLocaleString(); }});
           });
       }}, "-=0.5");

       // --- Slide 16: Brand Transition ---
    const t16 = gsap.timeline({ scrollTrigger: { trigger: "#slide-16", start: "top 60%", toggleActions: "play none none reverse" }});
    t16.to("#slide-16 .light-beam", { duration: 1.4, scaleX: 1, opacity: 1, ease: "expo.out" })
       .to("#slide-16 .light-beam", { duration: 0.8, opacity: 0, ease: "power2.in" }, "-=0.6")
       .to("#slide-16 .title-cn", { duration: 1.5, opacity: 1, y: 0, ease: "power3.out" }, "-=1.0")
       .to("#slide-16 .title-en", { duration: 1.5, opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out" }, "-=1.2");

    // --- Slide 17: Tmall Super Brand Day ---
    const section17 = document.getElementById("slide-17");
    const heroImg17 = document.querySelector("#slide-17 .p17-hero-img");
    if(window.innerWidth > 1200 && heroImg17) { 
        section17.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            gsap.to(heroImg17, { x: x, y: y, duration: 1, ease: "power2.out" });
        });
    }
    // --- Slide 17 Animation (Stable Version) ---
    const t17 = gsap.timeline({ 
        scrollTrigger: { 
            trigger: "#slide-17", 
            start: "top 60%", 
            toggleActions: "play none none reverse" 
        }
    });
    
    t17.to(".gsap-in-up-17", { duration: 0.8, opacity: 1, y: 0, stagger: 0.08, ease: "power3.out" })
       // 修复：只控制透明度和简单的位移，不再触碰 transform 的其他属性
       .fromTo(".p17-hero-backdrop", 
           { opacity: 0, x: -50 }, 
           { opacity: 1, x: 0, duration: 1.2, ease: "power2.out" }, 
           "-=1.0"
       )
       .from(".p17-hero-img", { xPercent: -15, opacity: 0, duration: 1.4, ease: "power2.out" }, "-=1.2");

    // --- Slide 18: Campaign Case ---
    const section18 = document.getElementById('slide-18');
    const colLeft18 = document.querySelector('.p18-pyramid-col');
    const colMid18 = document.querySelector('.p18-center-col');
    const colRight18 = document.querySelector('.model-container');
    if (window.innerWidth > 1024 && section18) {
        section18.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);
            gsap.to(colLeft18, { x: x * 20, y: y * 10, duration: 1, ease: "power2.out" });
            gsap.to(colMid18, { x: x * -15, y: y * -5, duration: 1, ease: "power2.out" });
            gsap.to(colRight18, { x: x * 10, y: y * 5, duration: 1, ease: "power2.out" });
        });
    }
    const tagGroup = document.querySelector('.model-tag-group');
    const tagPill = document.querySelector('.tag-pill');
    if(tagGroup && tagPill) {
        tagGroup.addEventListener('mouseenter', () => {
            gsap.to(tagGroup, { x: 4, duration: 0.05, repeat: 5, yoyo: true, onComplete: () => gsap.to(tagGroup, { x: 0 }) });
            gsap.to(tagPill, { backgroundColor: "#E60012", color: "#FFFFFF", scale: 1.05, borderColor: "#E60012", boxShadow: "0 0 20px rgba(230,0,18,0.4)", duration: 0.3 });
        });
        tagGroup.addEventListener('mouseleave', () => {
            gsap.to(tagPill, { backgroundColor: "rgba(255,255,255,0.9)", color: "#00308F", scale: 1, borderColor: "transparent", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", duration: 0.3 });
        });
    }
    const t18 = gsap.timeline({ scrollTrigger: { trigger: "#slide-18", start: "top 60%", toggleActions: "play none none reverse" }});
    t18.to(".gsap-in-18", { duration: 1, opacity: 1, ease: "power3.out" })
       .to(".gsap-up-18", { duration: 0.8, opacity: 1, y: 0, stagger: 0.1, ease: "back.out(1.2)" }, "-=0.5");

    // --- Slide 19: One-Eyed Angel ---
    const t19 = gsap.timeline({ scrollTrigger: { trigger: "#slide-19", start: "top 60%", toggleActions: "play none none reverse" }});
    t19.to(".gsap-fade-in-19", { duration: 0.8, opacity: 1, y: 0, ease: "power3.out" })
       .to(".gsap-left-19", { duration: 1, opacity: 1, x: 0, ease: "back.out(1.2)" }, "-=0.4")
       .to(".gsap-right-19", { duration: 0.6, opacity: 1, x: 0, stagger: 0.1, ease: "power2.out" }, "-=0.6");

    // --- Slide 20: JLR Lifestyle ---
    const t20 = gsap.timeline({ scrollTrigger: { trigger: "#slide-20", start: "top 85%", toggleActions: "play none none reverse" }});
    t20.to(".gsap-e1-reveal", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" })
       .to(".gsap-e1-parallax", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "back.out(1.1)" }, "-=0.5")
       .to(".gsap-e1-footer", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
    
    const section20 = document.getElementById('slide-20');
    const puzzleImg20 = document.querySelector('.e1-direct-img');
    const phone20 = document.querySelector('.e1-phone-body');
    if (window.innerWidth > 1024 && section20) {
        section20.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);
            gsap.to(puzzleImg20, { scale: 1.05 + (x * 0.05), duration: 1.5, ease: "power2.out" });
            gsap.to(phone20, { x: x * -10, y: y * -5, rotationY: x * 8, duration: 1.2 });
        });
    }

    // --- Slide 21: Content Transition ---
    const t21 = gsap.timeline({ scrollTrigger: { trigger: "#slide-21", start: "top 60%", toggleActions: "play none none reverse" }});
    t21.to("#slide-21 .light-beam", { duration: 1.2, scaleX: 1, opacity: 1, ease: "expo.out" })
       .to("#slide-21 .light-beam", { duration: 0.6, opacity: 0, ease: "power2.in" }, "-=0.5")
       .to("#slide-21 .title-cn", { duration: 1.6, opacity: 1, y: 0, ease: "power3.out" }, "-=0.8")
       .to("#slide-21 .title-en", { duration: 1.6, opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out" }, "-=1.4");

    // --- Slide 22: Content Studio (Gallery) ---
    const t22 = gsap.timeline({ scrollTrigger: { trigger: "#slide-22", start: "top 60%", toggleActions: "play none none reverse" }});
    t22.to(".gsap-fade-up-22", { duration: 1, opacity: 1, y: 0, ease: "power3.out" })
       .to(".col-single:first-child .gsap-scale-in-22", { duration: 0.8, opacity: 1, scale: 1, ease: "back.out(1.2)" }, "-=0.5")
       .to(".col-grid .gsap-scale-in-22", { duration: 0.6, opacity: 1, scale: 1, stagger: 0.08, ease: "power2.out" }, "-=0.4")
       .to(".col-single:last-child .gsap-scale-in-22", { duration: 0.8, opacity: 1, scale: 1, ease: "back.out(1.2)" }, "-=0.4");
    if (window.innerWidth > 1024) {
        document.getElementById('slide-22').addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            document.querySelectorAll('#slide-22 .gallery-col').forEach(col => {
                gsap.to(col, { x: x * 20, y: y * col.getAttribute('data-speed') * 0.5, duration: 1, ease: "power2.out" });
            });
        });
    }

    // --- Slide 23: Interior Design (Gallery) ---
    const t23 = gsap.timeline({ scrollTrigger: { trigger: "#slide-23", start: "top 60%", toggleActions: "play none none reverse" }});
    t23.to(".gsap-fade-up-23", { duration: 1, opacity: 1, y: 0, ease: "power3.out" })
       .to(".col-single:first-child .gsap-scale-in-23", { duration: 0.8, opacity: 1, scale: 1, ease: "back.out(1.2)" }, "-=0.5")
       .to(".col-grid .gsap-scale-in-23", { duration: 0.6, opacity: 1, scale: 1, stagger: 0.08, ease: "power2.out" }, "-=0.4")
       .to(".col-single:last-child .gsap-scale-in-23", { duration: 0.8, opacity: 1, scale: 1, ease: "back.out(1.2)" }, "-=0.4");

    // --- Slide 24: KOC Matrix ---
    const t24 = gsap.timeline({ scrollTrigger: { trigger: "#slide-24", start: "top 60%", toggleActions: "play none none reverse" }});
    t24.to(".gsap-reveal-up-24", { duration: 1, opacity: 1, y: 0, ease: "power3.out" })
       .to(".gsap-scale-fade-24", { duration: 0.5, opacity: 1, scale: 1, stagger: { grid: [3, 5], from: "start", amount: 1.0 }, ease: "back.out(1.5)" }, "-=0.8");

    // --- Slide 25: PDP Strategy ---
    const t25 = gsap.timeline({
        scrollTrigger: {
            trigger: "#slide-25", start: "top 60%", 
            onEnter: () => document.querySelectorAll('.pdp-image').forEach(img => img.style.animationPlayState = 'running')
        }
    });
    t25.to(".gsap-in-25", { duration: 1, opacity: 1, y: 0, ease: "power3.out" })
       .to(".pdp-track", { duration: 1, opacity: 1, y: 0, stagger: 0.1, ease: "power4.out" }, "-=0.5")
       .to("#p23Label", { duration: 0.8, x: 0, ease: "back.out(1.2)" }, "-=0.2");

    // --- Slide 26: Weibo & WeChat ---
    const t26 = gsap.timeline({ scrollTrigger: { trigger: "#slide-26", start: "top 60%", toggleActions: "play none none reverse" }});
    t26.to(".gsap-in-26", { duration: 0.8, opacity: 1, y: 0, ease: "power3.out" })
       .to(".gsap-scale-up-26", { duration: 1, opacity: 1, scale: 1, stagger: 0.2, ease: "back.out(1.2)" }, "-=0.4")
       .to(".gsap-in-26.phone-ui", { duration: 1, opacity: 1, y: 0, stagger: 0.2, ease: "power4.out" }, "-=0.6");

   // --- Slide 27: Star & KOC (修复版) ---
    // 强制使用 .to() 动画，确保从 0 变到 1
    const t27 = gsap.timeline({ 
        scrollTrigger: { 
            trigger: "#slide-27", 
            start: "top 60%", // 稍微提前触发，让用户更早看到
            toggleActions: "play none none reverse" 
        }
    });

    // 1. 背景蒙版变暗
    t27.to("#slide-27 .p25-overlay-mask", { 
        duration: 1.5, 
        opacity: 1, 
        ease: "power2.inOut" 
    })
    // 2. 核心内容浮现 (关键修改：使用 .to，将 opacity 变为 1)
    .to(".gsap-fade-27", { 
        duration: 0.8, 
        opacity: 1,       // 显形
        visibility: 'visible',
        y: 0,             // 归位
        stagger: 0.1, 
        ease: "power3.out" 
    }, "-=0.5");

    // --- Slide 28: AI Transition ---
    const t28 = gsap.timeline({ scrollTrigger: { trigger: "#slide-28", start: "top 60%", toggleActions: "play none none reverse" }});
    t28.to("#slide-28 .light-beam", { duration: 1.4, scaleX: 1, opacity: 1, ease: "expo.out" })
       .to("#slide-28 .light-beam", { duration: 0.8, opacity: 0, ease: "power2.in" }, "-=0.6")
       .to("#slide-28 .title-cn", { duration: 1.5, opacity: 1, y: 0, ease: "power3.out" }, "-=1.0")
       .to("#slide-28 .title-en", { duration: 1.5, opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out" }, "-=1.2");

    // --- Slide 29: AI Matrix ---
    // Generate Matrix Body
    const entities29 = [
        { type: "industry", name: "行业平均", label: "INDUSTRY<br>AVERAGE", icon: "📊" },
        { type: "brand", name: "BMW", logo: "assets/P37/" },
        { type: "brand", name: "MINI", logo: "assets/P26/mini.png" },
        { type: "brand", name: "LAND ROVER", logo: "assets/P26/landrover.png" },
        { type: "brand", name: "JAGUAR", logo: "assets/P26/jaguar.png" },
        { type: "brand", name: "Audi", logo: "assets/P26/audi.png" },
        { type: "brand", name: "ZEEKR", logo: "assets/P26/zeekr.png" },
        { type: "brand", name: "LYNK & CO", logo: "assets/P26/lynkco.png" }
    ];
    const dataMatrix29 = [
        [0,0,0,0,0,1, 0,0,1, 0,0,0, 1,1,0,0,1,0,0],
        [0,1,2,0,1,2, 0,0,1, 1,0,0, 2,2,0,1,2,2,0],
        [0,0,2,0,1,2, 2,0,0, 0,0,0, 1,1,1,2,0,0,0],
        [0,0,0,0,0,0, 0,0,0, 0,0,0, 1,1,1,2,0,0,1],
        [0,0,0,0,0,0, 0,0,0, 0,0,0, 1,1,1,2,0,0,0],
        [0,0,2,0,1,0, 0,0,0, 0,0,0, 1,1,1,2,1,1,0],
        [0,0,2,0,0,2, 2,0,0, 0,1,2, 0,1,0,1,1,2,0],
        [0,0,2,0,0,2, 2,0,0, 0,0,0, 0,1,0,1,1,2,0]
    ];
    const container29 = document.getElementById('p26MatrixBody');
    if(container29) {
        entities29.forEach((entity, index) => {
            const row = document.createElement('div');
            row.className = `brand-row ${entity.type === 'industry' ? 'row-industry' : ''}`;
            const brandBox = document.createElement('div');
            brandBox.className = 'brand-box';
            if (entity.type === 'industry') {
                brandBox.innerHTML = `<div><span class="industry-chart-icon">📈</span><div class="industry-label">${entity.label}</div></div>`;
            } else {
                brandBox.innerHTML = `<img class="brand-img" src="${entity.logo}" alt="${entity.name}" onerror="this.style.display='none';this.parentNode.innerHTML='<div style=\\'color:#fff;font-weight:700\\'>${entity.name}</div>';">`;
            }
            row.appendChild(brandBox);
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'dots-container';
            dataMatrix29[index].forEach(val => {
                const cell = document.createElement('div');
                let stateClass = 'dot-none';
                if (val === 1) stateClass = 'dot-light';
                if (val === 2) stateClass = 'dot-deep';
                cell.className = `dot-cell ${val > 0 ? 'active-dot' : ''} ${stateClass}`;
                cell.innerHTML = `<div class="ai-dot"></div>`;
                dotsContainer.appendChild(cell);
            });
            row.appendChild(dotsContainer);
            container29.appendChild(row);
        });
    }

    const t29 = gsap.timeline({ scrollTrigger: { trigger: "#slide-29", start: "top 80%", toggleActions: "play none none reverse" }});
    t29.from("#slide-29 .p26-header", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
       .from("#slide-29 .matrix-wrapper", { opacity: 0, duration: 1, ease: "power2.out" }, "-=0.4")
       .from("#slide-29 .brand-row", { x: -20, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }, "-=0.8")
       .to("#slide-29 .active-dot .ai-dot", { scale: 1, duration: 0.4, stagger: { amount: 1.0, from: "random" }, ease: "back.out(2)" }, "-=0.2");

    // --- Slide 30: AI Generation ---
    const t30 = gsap.timeline({ scrollTrigger: { trigger: "#slide-30", start: "top 60%", toggleActions: "play none none reverse" }});
    t30.from("#slide-30 .p27-title-main", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
       .from("#slide-30 .p27-hero-text", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, "-=0.4")
       .from("#slide-30 .aigc-card", { y: 80, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, "-=0.4");

    // --- Slide 31: AI Content Flow ---
    const t31 = gsap.timeline({ scrollTrigger: { trigger: "#slide-31", start: "top 60%", toggleActions: "play none none reverse" }});
    t31.from("#slide-31 .p28-title-main", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
       .from("#slide-31 .col-left", { y: 80, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4")
       .from("#slide-31 .col-mid .grid-item", { scale: 0.9, opacity: 0, duration: 0.6, stagger: { amount: 0.5, grid: [3, 2], from: "center" }, ease: "back.out(1.2)" }, "-=0.8")
       .from("#slide-31 .col-right", { y: 80, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6");

    // --- Slide 32: AI Video ---
    const animateIn32 = (element, delay = 0) => {
        gsap.to(element, {
            y: 0, opacity: 1, autoAlpha: 1, duration: 0.8, delay: delay, ease: "power3.out",
            scrollTrigger: { trigger: "#slide-32", start: "top 80%", toggleActions: "play none none none" }
        });
    };
    animateIn32("#slide-32 .p29-header", 0);
    animateIn32("#slide-32 .p29-hero-text", 0.2);
    document.querySelectorAll("#slide-32 .p29-module").forEach((mod, index) => {
        animateIn32(mod, 0.4 + (index * 0.2));
    });

    // --- Slide 33: Virtual Streamers ---
    const t33 = gsap.timeline({ scrollTrigger: { trigger: "#slide-33", start: "top 70%", toggleActions: "play none none reverse" }});
    t33.to("#slide-33 .p30-header", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
       .to("#slide-33 .phone-frame-wrap", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.1)" }, "-=0.4")
       .to("#slide-33 .headline-enclosed", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.1)" }, "<")
       .to("#slide-33 .premium-card", { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, "-=0.6")
       .to("#slide-33 .comparison-wrap", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
       .to("#slide-33 .platform-bar", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.2")
       .to("#slide-33 .data-banner-full", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<");

    // --- Slide 34: Ending ---
    const t34 = gsap.timeline({ scrollTrigger: { trigger: "#slide-34", start: "top 80%", toggleActions: "play none none reverse" }});
    t34.to("#slide-34 .gsap-p31-reveal", { duration: 1, opacity: 1, y: 0, stagger: 0.2, ease: "power3.out" })
       .to("#slide-34 .gsap-p31-hero", { duration: 1.5, opacity: 1, scale: 1, ease: "expo.out" }, "-=0.8")
       .to("#slide-34 .gsap-p31-fade", { duration: 1, opacity: 1, ease: "power2.inOut" }, "-=0.5");
    
    const section34 = document.querySelector("#slide-34");
    if (section34) {
        section34.addEventListener("mousemove", (e) => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
            gsap.to("#slide-34 .p31-main-content", { x: moveX, y: moveY, duration: 2.5, ease: "power2.out" });
        });
    }

    
    
});
