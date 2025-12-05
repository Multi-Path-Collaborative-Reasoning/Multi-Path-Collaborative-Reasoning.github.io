

// Tab Switching Logic for Examples Section
function switchTab(tabId) {
    // Hide all contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('block');
    });

    // Show selected content
    const selectedContent = document.getElementById(`${tabId}-content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedContent.classList.add('block');
    }

    // Update buttons state
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        // Reset styles
        btn.classList.remove('text-brand-700', 'bg-brand-50');
        btn.classList.add('text-gray-500');
        
        // Add active styles if clicked
        if (btn.textContent.toLowerCase().includes(tabId === 'math' ? 'mathematical' : 'knowledge')) {
            btn.classList.add('text-brand-700', 'bg-brand-50');
            btn.classList.remove('text-gray-500');
        }
    });
}

// Result Switching Logic
let chartKnowledgeInstance = null;
let chartStemInstance = null;

// Detailed Dataset Data from Table 1 and Table 2
const datasetData = {
    '1.5b': {
        knowledge: {
            labels: ['NQ', 'TriviaQA', 'HotpotQA', '2WikiMQA', 'Bamboogle'],
            grpo: [29.3, 48.0, 20.2, 21.3, 12.0],
            m3po: [41.4, 56.8, 28.7, 27.9, 23.2]
        },
        stem: {
            labels: ['GSM8k', 'MATH', 'MATH500', 'MMLU-STEM', 'ARC-C'],
            grpo: [68.2, 46.0, 45.2, 56.2, 73.7],
            m3po: [70.2, 47.4, 48.0, 58.1, 77.6]
        }
    },
    '3b': {
         knowledge: {
            labels: ['NQ', 'TriviaQA', 'HotpotQA', '2WikiMQA', 'Bamboogle'],
            grpo: [38.1, 57.0, 30.8, 30.3, 27.2],
            m3po: [44.1, 61.0, 33.2, 31.4, 31.2]
        },
        stem: {
            labels: ['GSM8k', 'MATH', 'MATH500', 'MMLU-STEM', 'ARC-C'],
            grpo: [83.4, 60.2, 60.4, 60.1, 81.4],
            m3po: [84.8, 60.7, 63.0, 61.6, 82.6]
        }
    }
};

const colors = {
    grpo: '#9ca3af', // Gray 400
    m3po: '#0ea5e9'  // Brand 500
};

function switchResults(modelSize) {
    // Update Buttons
    const buttons = document.querySelectorAll('.result-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(modelSize)) {
            btn.classList.add('text-brand-700', 'bg-white', 'shadow-sm');
            btn.classList.remove('text-gray-500');
        } else {
            btn.classList.remove('text-brand-700', 'bg-white', 'shadow-sm');
            btn.classList.add('text-gray-500');
        }
    });

    // Update Charts
    const data = datasetData[modelSize];
    
    if (chartKnowledgeInstance) {
        chartKnowledgeInstance.data.datasets[0].data = data.knowledge.grpo;
        chartKnowledgeInstance.data.datasets[1].data = data.knowledge.m3po;
        chartKnowledgeInstance.update();
    }

    if (chartStemInstance) {
        chartStemInstance.data.datasets[0].data = data.stem.grpo;
        chartStemInstance.data.datasets[1].data = data.stem.m3po;
        chartStemInstance.update();
    }
}


// Tab Switching Logic for Examples Section
function switchTab(tabId) {
    // Hide all contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('block');
    });

    // Show selected content
    const selectedContent = document.getElementById(`${tabId}-content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedContent.classList.add('block');
    }

    // Update buttons state
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        // Reset styles
        btn.classList.remove('text-brand-700', 'bg-brand-50');
        btn.classList.add('text-gray-500');
        
        // Match button text to tabId
        const btnText = btn.textContent.toLowerCase();
        let isActive = false;
        
        if (tabId === 'math' && btnText.includes('math')) isActive = true;
        if (tabId === 'knowledge' && btnText.includes('knowledge')) isActive = true;
        if (tabId === 'stem' && btnText.includes('stem')) isActive = true;

        if (isActive) {
            btn.classList.add('text-brand-700', 'bg-brand-50');
            btn.classList.remove('text-gray-500');
        }
    });
}

// Copy Citation
function copyCitation() {
    const text = document.getElementById('citation-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('BibTeX copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Initialize Charts and Other Components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Results Charts
    initCharts();

    // Initialize Method Tree Animation
    initMethodTree();
});

function initCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { family: "'Inter', sans-serif", size: 12 },
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                padding: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#4b5563',
                borderColor: '#e5e7eb',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: true, color: '#f3f4f6' },
                ticks: { font: { family: "'Inter', sans-serif" } },
                title: { display: true, text: 'Accuracy (%)' }
            },
            x: {
                grid: { display: false },
                ticks: { font: { family: "'Inter', sans-serif" } }
            }
        },
        animation: {
            duration: 750,
        }
    };

    // Default Data (1.5B)
    const initialData = datasetData['1.5b'];

    // Initialize Knowledge Chart (Left)
    const ctxKnowledge = document.getElementById('chartKnowledge');
    if (ctxKnowledge) {
        chartKnowledgeInstance = new Chart(ctxKnowledge, {
            type: 'bar',
            data: {
                labels: initialData.knowledge.labels,
                datasets: [
                    {
                        label: 'GRPO',
                        data: initialData.knowledge.grpo,
                        backgroundColor: colors.grpo,
                        borderRadius: 4,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: 'M3PO',
                        data: initialData.knowledge.m3po,
                        backgroundColor: colors.m3po,
                        borderRadius: 4,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    }
                ]
            },
            options: commonOptions
        });
    }

    // Initialize STEM Chart (Right)
    const ctxStem = document.getElementById('chartStem');
    if (ctxStem) {
        chartStemInstance = new Chart(ctxStem, {
            type: 'bar',
            data: {
                labels: initialData.stem.labels,
                datasets: [
                    {
                        label: 'GRPO',
                        data: initialData.stem.grpo,
                        backgroundColor: colors.grpo,
                        borderRadius: 4,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: 'M3PO',
                        data: initialData.stem.m3po,
                        backgroundColor: colors.m3po,
                        borderRadius: 4,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    }
                ]
            },
            options: commonOptions
        });
    }
}

// Animation for Method Section
function initMethodTree() {
    const canvas = document.getElementById('methodTreeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Resize handler
    const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        // Set actual canvas size to match display size for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        // CSS display size
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        width = rect.width;
        height = rect.height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Animation state
    let time = 0;
    const numPaths = 4;
    const steps = 6;
    
    function draw() {
        if (!width || !height) return requestAnimationFrame(draw);

        ctx.clearRect(0, 0, width, height);
        time += 0.004;
        if (time > 1.3) time = 0; // Loop animation

        const pathGap = height / (numPaths + 1);
        const startX = 60;
        const endX = width - 40;
        const totalLength = endX - startX;
        
        // Animation Phase Logic
        const drawProgress = Math.min(1, time * 1.5); // Paths extend to 100% width by time=0.66
        
        // Draw Paths
        for (let i = 1; i <= numPaths; i++) {
            const y = i * pathGap;
            
            // Background Track
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + totalLength, y);
            ctx.strokeStyle = '#f1f5f9'; // slate-100
            ctx.lineWidth = 2;
            ctx.stroke();

            // Active Path
            if (time < 1.1) {
                ctx.beginPath();
                ctx.moveTo(startX, y);
                const currentX = startX + totalLength * drawProgress;
                ctx.lineTo(currentX, y);
                ctx.strokeStyle = '#e0f2fe'; // brand-100
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        // Draw Steps (Nodes) and Collaboration (Vertical Lines)
        const stepDist = totalLength / (steps - 1);
        const currentHeadPos = startX + totalLength * drawProgress;

        for (let s = 0; s < steps; s++) {
            const sx = startX + s * stepDist;
            
            // Check if head passed this step
            if (sx <= currentHeadPos && time < 1.1) {
                // Draw Node
                for (let i = 1; i <= numPaths; i++) {
                    const y = i * pathGap;
                    ctx.beginPath();
                    ctx.arc(sx, y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = '#0284c7'; // brand-600
                    ctx.fill();
                }

                // Check for Collaboration Trigger
                // Trigger collaboration effect when head is near the step
                const distanceToHead = Math.abs(currentHeadPos - sx);
                if (distanceToHead < 40 && s > 0) { // Don't collaborate at start node
                    const opacity = 1 - (distanceToHead / 40);
                    
                    // Vertical Connection Line
                    ctx.beginPath();
                    ctx.moveTo(sx, pathGap);
                    ctx.lineTo(sx, pathGap * numPaths);
                    ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`; // Amber-500
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Highlight Nodes
                    for (let i = 1; i <= numPaths; i++) {
                        const y = i * pathGap;
                        ctx.beginPath();
                        ctx.arc(sx, y, 10, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(14, 165, 233, ${opacity * 0.4})`; // brand-500 glow
                        ctx.fill();
                    }
                }
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}