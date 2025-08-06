const puppeteer = require('puppeteer');

(async () => {
    console.log('🔍 Analyzing Stinky Lee Sprite Sheet\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1400, height: 900 }
    });
    
    const page = await browser.newPage();
    
    // Create a custom page to analyze the sprite sheet
    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #1a1a1a; 
                    color: white; 
                    font-family: monospace;
                }
                canvas { 
                    border: 2px solid #ff00ff; 
                    display: block; 
                    margin: 20px 0;
                    image-rendering: pixelated;
                }
                .info { 
                    padding: 10px; 
                    background: rgba(255,0,255,0.2); 
                    margin: 10px 0;
                }
                .row-preview {
                    display: flex;
                    gap: 10px;
                    margin: 10px 0;
                    padding: 10px;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid #444;
                }
                .frame-box {
                    border: 1px solid #666;
                    padding: 2px;
                }
                .frame-box canvas {
                    border: none;
                    margin: 0;
                }
                h3 { color: #ff00ff; }
            </style>
        </head>
        <body>
            <h1>Sprite Sheet Analysis - Stinky Lee</h1>
            <div id="info"></div>
            <canvas id="fullSheet"></canvas>
            <div id="rows"></div>
            
            <script>
                const img = new Image();
                img.onload = function() {
                    // Display full sprite sheet
                    const canvas = document.getElementById('fullSheet');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, 0, 0);
                    
                    // Display info
                    const info = document.getElementById('info');
                    info.innerHTML = \`
                        <div class="info">
                            <strong>Sprite Sheet Dimensions:</strong> \${img.width} x \${img.height}<br>
                            <strong>Frame Size:</strong> 32 x 30<br>
                            <strong>Grid:</strong> \${Math.floor(img.width/32)} columns x \${Math.floor(img.height/30)} rows<br>
                            <strong>Total Frames:</strong> \${Math.floor(img.width/32) * Math.floor(img.height/30)}
                        </div>
                    \`;
                    
                    // Analyze each row
                    const rowsDiv = document.getElementById('rows');
                    const rows = Math.floor(img.height / 30);
                    
                    for (let row = 0; row < rows; row++) {
                        const rowDiv = document.createElement('div');
                        rowDiv.innerHTML = \`<h3>Row \${row} (frames \${row * 32} - \${row * 32 + 7})</h3>\`;
                        
                        const previewDiv = document.createElement('div');
                        previewDiv.className = 'row-preview';
                        
                        // Show first 8 frames of this row
                        for (let col = 0; col < 8; col++) {
                            const frameDiv = document.createElement('div');
                            frameDiv.className = 'frame-box';
                            
                            const frameCanvas = document.createElement('canvas');
                            frameCanvas.width = 64;  // 2x scale
                            frameCanvas.height = 60;  // 2x scale
                            const frameCtx = frameCanvas.getContext('2d');
                            frameCtx.imageSmoothingEnabled = false;
                            
                            // Draw this frame
                            frameCtx.drawImage(
                                img,
                                col * 32, row * 30,  // source x, y
                                32, 30,              // source width, height
                                0, 0,                // dest x, y
                                64, 60               // dest width, height (2x scale)
                            );
                            
                            frameDiv.appendChild(frameCanvas);
                            previewDiv.appendChild(frameDiv);
                        }
                        
                        rowDiv.appendChild(previewDiv);
                        
                        // Add description based on typical sprite sheet layout
                        const descriptions = [
                            'Row 0: Idle/Standing (front view)',
                            'Row 1: Walk DOWN (toward viewer)',
                            'Row 2: Walk LEFT (side profile)',
                            'Row 3: Walk RIGHT (side profile)',
                            'Row 4: Walk UP (away from viewer - back/tail view)',
                            'Row 5: Sleep animation',
                            'Row 6: Eat animation',
                            'Row 7: Groom animation',
                            'Row 8: Play animation',
                            'Row 9: Run animation',
                            'Row 10: Jump animation',
                            'Row 11: Unknown',
                            'Row 12: Unknown',
                            'Row 13: Unknown',
                            'Row 14: Unknown',
                            'Row 15: Unknown'
                        ];
                        
                        const desc = document.createElement('div');
                        desc.style.color = '#0ff';
                        desc.style.marginTop = '5px';
                        desc.textContent = descriptions[row] || 'Row ' + row;
                        rowDiv.appendChild(desc);
                        
                        rowsDiv.appendChild(rowDiv);
                    }
                };
                img.src = 'http://localhost:8080/assets/sprites/stinkylee.png';
            </script>
        </body>
        </html>
    `);
    
    // Wait for image to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot of the analysis
    await page.screenshot({ 
        path: 'sprite-sheet-analysis.png',
        fullPage: true
    });
    
    console.log('✅ Analysis complete! Check sprite-sheet-analysis.png');
    console.log('\nBased on the analysis, you should be able to see:');
    console.log('- Which row has the full cat walking away (back view with tail)');
    console.log('- Which row might be cut off or showing partial sprites');
    console.log('- The exact frame ranges for each animation');
    
    // Keep browser open for manual inspection
    console.log('\n👀 Browser window left open for manual inspection.');
    console.log('Close the browser window when done.');
    
    // Don't close browser automatically
    // await browser.close();
})();