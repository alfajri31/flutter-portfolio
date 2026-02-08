async function downloadToDocx(content) {
    const { Document, Packer, Paragraph, TextRun, ImageRun, Header,SectionType,AlignmentType,PageNumber,Footer } = window.docx;

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(content, "text/html");
    const elements = parsedHtml.body.children;

    // const myCss = await fetchStylesFromCSS('http://localhost:5501/stylesheet/main.css');
    const paragraphs =  [];
    const response = await fetch("assets/background-image-cv.jpg");
    const imageBlob = await response.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const roundedBlob = await makeImageRounded("assets/profil.jpg");
    let cvOnline;

    Array.from(elements).map(element => {
        let contentElement;
        let textContent;
        if (element.id === "aboutMe" || element.id === "education" || element.id === "abilities" || element.id === "historyExperience" ||  element.id === "contactMe" ||  element.id === "certificate" || element.id === "demoProjects") {
            textContent = element.textContent || element.innerText;
            textContent = cleanText(textContent);
            if(element.id === "aboutMe") {
                  // Adding an image at the beginning of the "About Me" section
                  paragraphs.push(
                    new Paragraph({
                        alignment: "center",
                        spacing: {after:500},
                        children: [
                            new ImageRun({
                                data: roundedBlob.arrayBuffer(),
                                transformation: {
                                    width: 150, // Image width
                                    height: 150, // Image height
                                }
                            })
                        ],
                    })
                );

                paragraphs.push(
                    new Paragraph({
                        space:{after:240},
                        children: [
                            new TextRun({}),
                        ],
                    })
                );

                textContent = removeAfterDate(textContent);
                paragraphs.push(
                    new Paragraph({
                        alignment: "left",
                        children: [
                            new TextRun({
                                text: textContent,
                                font: "Arial",
                                bold: true,
                                size: 48,
                                color: "000000", 
                            }),
                        ],
                    })
                );
            }
            else if(element.id === "historyExperience") {
                textContent = removeAfterHistoryExperienceHeader(textContent)
                paragraphs.push(
                    new Paragraph({
                        alignment: "left",
                        spacing: {before: 840},
                        children: [
                            new TextRun({
                                text: textContent,
                                font: "Arial",
                                bold: true,
                                size: 48,
                                color: "000000", 
                            }),
                        ],
                    })
                );
            }
            else {
                paragraphs.push(
                    new Paragraph({
                        alignment: "left",
                        spacing: {before: 840},
                        children: [
                            new TextRun({
                                text: textContent,
                                font: "Arial",
                                bold: true,
                                size: 48,
                                color: "000000", 
                            }),
                        ],
                    })
                );
            }
          
            contentElement = Array.from(elements).find( 
                sibling => sibling.id === "show-"+element.id
            );
            if(contentElement.id==="show-historyExperience") {
                const experiences = contentElement.querySelector(".experience");
                if (experiences) {
                    const row = experiences.children; 
                    const rowLength = row.length;
                    let rowIndex=0;
                    if(rowIndex==0) {
                        before=500
                    }
                    paragraphs.push(
                        new Paragraph({
                            alignment: "both",
                            spacing: {before:0},
                            children: [
                                new TextRun({
                                }),
                            ],
                        })
                    );

                    Array.from(row).forEach(childRow => {
                        const description = childRow.children;
                        Array.from(description).find(child=> {
                            Array.from(child.children).find(childRow => {
                                if (/.*-translate-.*/.test(childRow.id)) { 
                                    const li = childRow.children;
                                    Array.from(li).forEach(li => {
                                        li = li.getElementsByTagName("li");
                                        if(li) {
                                            Array.from(li).forEach(listRow => {
                                                console.log(listRow.innerText)
                                                paragraphs.push(
                                                 new Paragraph({
                                                     alignment: "both",
                                                     spacing: {before: 150,line:220},
                                                     children: [
                                                         new TextRun({
                                                             text: `• ${listRow.innerText}`,
                                                             font: "Arial",
                                                             bold: false,
                                                             size: 24,
                                                             color: "000000", 
                                                         }),
                                                     ],
                                                    })
                                                ); 
                                            })
                                        }
                                    })
                    
                                }
                                else {
                                    const children = childRow.children;
                                    let textContent;
                                    let before = 0;
                                    let shouldBeBold = false;
                                    if(children.length > 0) {
                                        Array.from(children).forEach((child,i) => {
                                            textContent = cleanText(child.innerText);
                                            shouldBeBold = true;
                                            before = 0;
                                         })
                                    }
                                    else {
                                        textContent = cleanText(childRow.innerText);
                                        shouldBeBold = false;
                                        before = 240;
                                    }
                                    textContent.split("\n").forEach(textContent => {
                                        paragraphs.push(
                                            new Paragraph({
                                                alignment: "both",
                                                spacing: {line:260,before:before},
                                                children: [
                                                    new TextRun({
                                                        text:  textContent,
                                                        font: "Arial",
                                                        bold: shouldBeBold,
                                                        size: 30,
                                                        color: "000000", 
                                                    }),
                                                ],
                                            })
                                        );
                                    })
                                
                                   
                                }
                            });
                        })

                        if(rowIndex < rowLength-1)
                        // end class row for show-experience
                        paragraphs.push(
                            new Paragraph({
                                alignment: "both",
                                spacing: {after:500},
                                children: [
                                    new TextRun({
                                    }),
                                ],
                            })
                        );
                        rowIndex++;
                    });  
                }
            }
            else if(contentElement.id==="show-contactMe") {
                    const description = contentElement.children;
                    Array.from(description).find(child=> {
                        const text = child.innerText;
                        const regex = /CV online\s*:\s*(https?:\/\/[^\s]+)/;
                        const match = text.match(regex);
                        if (match) {
                            cvOnline = match[1]; // The first capturing group contains the URL
                        }
                        paragraphs.push(
                            new Paragraph({
                                alignment: "left",
                                spacing: {before:240,line:260},
                                children: [
                                    new TextRun({
                                        text: cleanText(child.innerText),
                                        font: "Arial",
                                        bold: false,
                                        size: 24,
                                        color: "000000", 
                                    }),
                                ],
                            })
                        );
                })
                
            }
            else if(contentElement.id==="show-abilities") {
                const description = contentElement.children;
                Array.from(description).find(child=> {
                    paragraphs.push(
                        new Paragraph({
                            alignment: "left",
                            spacing: {before:240,line:360},
                            children: [
                                new TextRun({
                                    text: cleanTextWithComma(child.innerText),
                                    font: "Arial",
                                    bold: false,
                                    size: 24,
                                    color: "000000", 
                                }),
                            ],
                        })
                    );
            })
            }
            else if(contentElement.id==="show-certificate") {
                const children = contentElement.children;
                Array.from(children).find(children=> {
                    Array.from(children.children).find(children => {
                        Array.from(children.children).forEach((child,i) => {
                            const textContent = child.children;
                            if(textContent.length > 0) {
                                console.log(child.innerText);
                                paragraphs.push(
                                    new Paragraph({
                                        alignment: "left",
                                        spacing: {before:140,line:260},
                                        children: [
                                            new TextRun({
                                                text: cleanTextWithComma(child.innerText),
                                                font: "Arial",
                                                bold: false,
                                                size: 24,
                                                color: "000000", 
                                            }),
                                        ],
                                    })
                                );
                            }
                        
                        })
                    })
            })
            }
            else if(contentElement.id==="show-demoProjects") {
                const description = contentElement.children;
                Array.from(description).find(child=> {
                    const text = child.innerText;
                    const regex = /CV online\s*:\s*(https?:\/\/[^\s]+)/;
                    const match = text.match(regex);
                    if (match) {
                        cvOnline = match[1]; // The first capturing group contains the URL
                    }
                    paragraphs.push(
                        new Paragraph({
                            alignment: "left",
                            spacing: {before:240,line:260},
                            children: [
                                new TextRun({
                                    text: cleanText(child.innerText),
                                    font: "Arial",
                                    bold: false,
                                    size: 24,
                                    color: "000000", 
                                }),
                            ],
                        })
                    );
            })
            
            }
            else {
                textContent = cleanText(contentElement.textContent || contentElement.innerText);
                paragraphs.push(
                    new Paragraph({
                        alignment: "both",
                        spacing: {before: 240,line:360},
                        children: [
                            new TextRun({
                                text: textContent,
                                font: "Arial",
                                bold: false,
                                size: 24,
                                color: "000000", 
                            }),
                        ],
                    })
                );
            }
        }
    })

    // Title as a normal paragraph (NOT in header)
    const titleParagraph = new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({
                text: "Curriculum Vitae",
                font: "Arial",
                color: "000000", // Black text
                size: 60, // 30 * 2 = 60 half-points = ~30pt
                bold: true,
            }),
        ],
        spacing: {
            after: 2000, // adjust spacing as needed
        },
    });


    // Load your background image
    const backgroundImage = new ImageRun({
            data: imageArrayBuffer,
            transformation: {
                width: 895,  // A4 page width in points
                height: 1150, // A4 page height in points
            },
            floating: {
                horizontalPosition: {
                    relative: "page",
                    offset: 0,
                },
                verticalPosition: {
                    relative: "page",
                    offset: 0,
                },
                wrap: {
                    type: "none", // no text wrapping; image sits behind
                },
                behindDocument: true, // this makes it act like a background
            },
    });
    

    const backgroundImageParagraph = new Paragraph({
        children: [backgroundImage],
    });
    

    // the watermark header (centered and large text)
    const watermarkHeader = new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER, // Center the watermark
                children: [
                    new TextRun({
                        text: "Curriculum Vitae", // Watermark text
                        font: "Arial",
                        color: "D3D3D3", // Light gray for watermark effect
                        size: 30, // Large size for watermark
                        bold: true,
                        // Add more styling if needed
                    }),
                ],
                spacing : {
                    after: 500
                }
            }),
        ],
    });

    const watermarkFooter = new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: cvOnline, 
                        font: "Arial",
                        color: "D3D3D3", 
                        size: 30, 
                        bold: true,
                    }),
                ],
                spacing : {
                    before: 300
                }
            }),
        ],
    });

    const doc = new Document({
        sections: [
            {
                properties: {
                    type: SectionType.CONTINUOUS, // Continuous section (no page breaks)
                },
                // headers: {
                //     default: watermarkHeader, // Add watermark in the footer,not working if use background iamge
                // },
                footers: {
                    default: watermarkFooter, // Add watermark in the footer
                },
                children: [
                   backgroundImageParagraph,
                   titleParagraph,
                    ...paragraphs
                ], // Main document content
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    window.saveAs(blob, "Muhammad Al Fajri CV Software Engineering.docx");
}

// Fetch and parse the external CSS file
async function fetchStylesFromCSS(cssFile) {
    const response = await fetch(cssFile);
    const cssText = await response.text();
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(cssText);
    return styleSheet;
}

// Function to clean up text content

// Function to clean up text content
function cleanText(text) {
    return text
        .replace(/&nbsp;/g,'')  
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim())
        .filter(line => line.trim() !== '')
        .join('\n');
}

function cleanTextWithComma(text) {
    return text
        .replace(/&nbsp;/g, '') 
        .split('\n') 
        .map(line => line.replace(/\s+/g, ' ').trim()) 
        .filter(line => line.trim() !== '') 
        .join(', ');
}

function makeImageRounded(imageUrl) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            const size = Math.min(img.width, img.height); // Crop to a square
            canvas.width = size;
            canvas.height = size;

            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);

            canvas.toBlob((blob) => resolve(blob));
        };

        img.onerror = reject;
        img.src = imageUrl;
    });
}

function removeAfterDate(text) {
    // Find the position of "31 Desember 1993,"
    const datePattern = /31 Desember 1993/;
    const match = text.match(datePattern);
    if (match) {
        // Keep everything before the date (including the date)
        return text.substring(0, match.index + match[0].length).trim();
    }
    return text;  // Return the original text if no date is found
}

function removeAfterHistoryExperienceHeader(text) {
    // Find the position of "31 Desember 1993,"
    const datePattern = /Experiences/;
    const match = text.match(datePattern);
    if (match) {
        // Keep everything before the date (including the date)
        return text.substring(0, match.index + match[0].length).trim();
    }
    return text;  // Return the original text if no date is found
}
function makeBold(textContent, shouldBold = false) {
    return {
        text: textContent,
        font: "Arial",
        bold: shouldBold,
        size: 24,
        color: "000000",
    };
}
