document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMACIÓN DE LA MONTAÑA DE ESCOMBROS (400 PIEZAS)
    const mosaic = document.getElementById('mosaic');
    const overlay = document.getElementById('intro-overlay');
    const msg = document.getElementById('intro-msg');

    const rows = 20;
    const cols = 20;
    const totalW = 600;
    const totalH = 400;
    const fW = totalW / cols;
    const fH = totalH / rows;
    const fragments = [];

    // Crear la "Montaña de Escombros" inicial
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const f = document.createElement('div');
            f.className = 'fragment';
            f.style.width = `${fW}px`;
            f.style.height = `${fH}px`;
            f.style.backgroundPosition = `-${c * fW}px -${r * fH}px`;

            // ESTADO INICIAL: Amontonados abajo (piso) como basura
            // X centrada con desvío, Y muy abajo
            const initialX = (totalW / 2) + (Math.random() - 0.5) * 300 - (fW / 2);
            const initialY = totalH - (Math.random() * 50); // Acumulados en la base
            const initialRot = (Math.random() - 0.5) * 1000;

            f.style.left = `${initialX}px`;
            f.style.top = `${initialY}px`;
            f.style.transform = `rotate(${initialRot}deg) scale(0.6)`;
            f.style.opacity = '0';

            mosaic.appendChild(f);
            fragments.push({ node: f, r, c });
        }
    }

    // Aparecen en la pila
    fragments.forEach((f, i) => {
        setTimeout(() => f.node.style.opacity = '1', i * 0.5);
    });

    // RECONSTRUCCIÓN (3 Segundos)
    setTimeout(() => {
        msg.style.opacity = '1';
        fragments.forEach(f => {
            f.node.style.left = `${f.c * fW}px`;
            f.node.style.top = `${f.r * fH}px`;
            f.node.style.transform = `rotate(0deg) scale(1)`;
        });
    }, 1500);

    // Salir de intro
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 1200);
    }, 6000);

    // 2. ARTÍCULOS TÉCNICOS
    const articles = [
        {
            title: "Madera Noble Recobrada",
            text: "La madera de demolición es un tesoro térmico. Al ser madera que ya 'trabajó', no se deforma. Su capacidad aislante es 15 veces superior al hormigón. BioArq utiliza maderas recuperadas que garantizan una huella de carbono negativa."
        },
        {
            title: "Chapa e Industria Circular",
            text: "El metal es infinitamente reciclable. Usamos chapas industriales recuperadas para cubiertas inteligentes. Combinadas con cámaras de aire, estas chapas protegen la casa del sol radiante del verano y mantienen el calor en invierno."
        },
        {
            title: "Salud y Bienestar Bioclimático",
            text: "Construir con barro, madera y metal reutilizado permite que la casa 'respire'. Evitamos resinas y pegamentos tóxicos, creando ambientes con humedad controlada y aire puro."
        }
    ];

    window.showArticle = (idx) => {
        const btns = document.querySelectorAll('.art-btn');
        btns.forEach((b, i) => b.classList.toggle('active', i === idx));

        const viewer = document.getElementById('article-viewer');
        viewer.style.opacity = '0';
        setTimeout(() => {
            viewer.innerHTML = `
                <div class="article-content">
                    <h3>${articles[idx].title}</h3>
                    <p>${articles[idx].text}</p>
                </div>
            `;
            viewer.style.opacity = '1';
        }, 300);
    };

    // 3. CONFIGURADOR (10 PASOS)
    const questions = [
        { q: "¿Qué tipo de vida proyectás?", opts: ["Residencia de familia", "Refugio de descanso", "Espacio de trabajo"] },
        { q: "¿Cuántos m² necesitás?", opts: ["Micro (45m²)", "Estandar (90m²)", "Master (160m²)"], vals: [45, 90, 160] },
        { q: "¿Dormitorios?", opts: ["1 Habitación", "2 Habitaciones", "3 o más"], vals: [0, 5000, 12000] },
        { q: "Estructura principal:", opts: ["Madera Maciza", "Metal Industrial Re-uso", "Sistema Híbrido"], key: 'mat' },
        { q: "Aislación bioclimática:", opts: ["Lana de Oveja (Local)", "Celulosa Inyectada", "Doble barrera seca"] },
        { q: "Aberturas de alta eficiencia:", opts: ["Madera + DVH", "Aluminio RPT", "PVC Sustentable"] },
        { q: "Diseño de Cubierta:", opts: ["Techo Vivo (Bio)", "Chapa Acanalada", "Panel Fotovoltaico"] },
        { q: "Terminación Exterior:", opts: ["Madera Quemada", "Chapa Oxidada", "Siding Orgánico"] },
        { q: "Autonomía Energética:", opts: ["Solar Completo", "Híbrido Social", "Red Convencional"] },
        { q: "Saneamiento Ecológico:", opts: ["Biodigestor Pro", "Cisterna de Lluvia", "Estándar"] }
    ];

    let step = 0;
    let answers = [];
    const qCont = document.getElementById('q-container');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const pFill = document.getElementById('progress-fill');

    function render() {
        const item = questions[step];
        qCont.innerHTML = `
            <div class="q-display">
                <small>Paso ${step + 1} de 10</small>
                <h2>${item.q}</h2>
                <div class="opts-grid">
                    ${item.opts.map((o, i) => `
                        <button class="option ${answers[step] === i ? 'selected' : ''}" onclick="window.setS(${i})">${o}</button>
                    `).join('')}
                </div>
            </div>
        `;
        pFill.style.width = `${((step + 1) / 10) * 100}%`;
        nextBtn.innerHTML = step === 9 ? "Generar Presupuesto" : "Siguiente paso";
        nextBtn.disabled = answers[step] === undefined;
        backBtn.disabled = step === 0;
    }

    window.setS = (i) => { answers[step] = i; render(); };
    nextBtn.onclick = () => { if (step < 9) { step++; render(); } else { finalize(); } };
    backBtn.onclick = () => { step--; render(); };

    function finalize() {
        const m2 = questions[1].vals[answers[1]];
        let cost = m2 * 1100;
        if (answers[3] === 0) cost += 10000;
        cost += questions[2].vals[answers[2]];

        document.getElementById('configurador').hidden = true;
        const resSec = document.getElementById('resultados');
        resSec.hidden = false;

        document.getElementById('res-price').textContent = `USD ${Math.round(cost).toLocaleString()}`;

        // Gallery
        const gallery = {
            madera: ["https://images.unsplash.com/photo-1542718610-a1d656d1884c", "https://images.unsplash.com/photo-1510798831971-661eb04b3739", "https://images.unsplash.com/photo-1449156001933-469b4b1cc3a1", "https://images.unsplash.com/photo-1464146072230-91cabc968266"],
            metal: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750", "https://images.unsplash.com/photo-1500315331616-db4f707c24d1", "https://images.unsplash.com/photo-1484154218962-a197022b5858", "https://images.unsplash.com/photo-1505691938895-1758d7eaa511"],
            hibrido: ["https://images.unsplash.com/photo-1470770841072-f978cf4d019e", "https://images.unsplash.com/photo-1413143525191-f925000780f8", "https://images.unsplash.com/photo-1523217582562-09d0def993a6", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e"]
        };

        const type = answers[3] === 0 ? 'madera' : (answers[3] === 1 ? 'metal' : 'hibrido');
        const grid = document.getElementById('results-grid');
        grid.innerHTML = gallery[type].map((url) => `<div class="res-img"><img src="${url}?auto=format&fit=crop&w=800"></div>`).join('');

        const wa = document.getElementById('wa-link');
        const msg = `Hola BioArq! Analicé mi casa de ${m2}m². Presupuesto: USD ${Math.round(cost)}.`;
        wa.href = `https://wa.me/5491100000000?text=${encodeURIComponent(msg)}`;

        resSec.scrollIntoView();
    }

    render();
});
