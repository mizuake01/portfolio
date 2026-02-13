document.addEventListener('DOMContentLoaded', () => {

    // --- 1. タイピングアニメーション & フェードイン (ヒーロー) ---
    const textToType = "mizuake";
    const typingElement = document.querySelector('.typing-text');
    let typeIndex = 0;

    function typeText() {
        if (typeIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(typeIndex);
            typeIndex++;
            setTimeout(typeText, 150); // タイピング速度
        }
    }

    // 少し遅延させて開始
    setTimeout(typeText, 500);

    // 要素のフェードイン
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach((el) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 1500); // タイピング後に表示
    });

    // --- 2. Canvas パーティクルアニメーション ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(108, 99, 255, ' : 'rgba(0, 212, 170, '; // アクセントカラー
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.min(width * 0.1, 100); // レスポンシブな数
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        // パーティクルと線の描画
        particles.forEach((p, i) => {
            p.update();
            p.draw();

            // 近くのパーティクル同士を線で結ぶ
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 100, 255, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    resizeCanvas();
    initParticles();
    animateParticles();


    // --- 3. スクロールアニメーション & ヘッダー制御 ---
    const header = document.querySelector('.header');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // プログレスバーのアニメーション
                if (entry.target.querySelector('.progress-bar')) {
                    const bars = entry.target.querySelectorAll('.progress-bar');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
            }
        });
    }, observerOptions);

    // セクション監視
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.classList.add('fade-in-up');
        observer.observe(sec);
    });

    // タイムラインアイテムの遅延表示
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
        item.classList.add('fade-in-up');
        observer.observe(item);
    });

    // スティッキーヘッダー
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // ナビゲーションのアクティブ表示
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // --- 4. フィルタリング機能 ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const works = document.querySelectorAll('.work-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブボタンの切り替え
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            works.forEach(work => {
                const category = work.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    work.style.display = 'block';
                    setTimeout(() => {
                        work.style.opacity = '1';
                        work.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    work.style.opacity = '0';
                    work.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        work.style.display = 'none';
                    }, 400); // CSSのtransitionに合わせる
                }
            });
        });
    });

    // --- 5. モバイルメニュー ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

    menuToggle.addEventListener('click', () => {
        mobileOverlay.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
        });
    });

    // --- 6. フォーム送信モック ---
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // 実際のアクションURLがプレースホルダーのため、デモ用にメッセージを表示
            if (form.getAttribute('action').includes('YOUR_FORM_ID')) {
                e.preventDefault();
                const status = document.querySelector('.form-status');
                status.style.display = 'block';
                form.reset();
            }
        });
    }

});
