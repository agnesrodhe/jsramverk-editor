import { jsPDF } from "jspdf";

function GeneratePdf({ currentDoc }) {
    function createPDF() {
        const doc = new jsPDF('p', 'px', 'a4', true);
        const textBody = document.getElementsByClassName("trix")[0];
        const html = `<div style="width:620px;height:800px;">${textBody.innerHTML}</div>`;
        doc.html(html, {
            html2canvas: {
                scale: 0.6
            },
            callback: function (doc) {
                doc.save(currentDoc.name);
            },
            autoPaging: 'text',
            margin: [30, 20, 10, 20],
            x: 20,
            y: 20
        });
    }

    return (
        <button className="saveBtn" onClick={createPDF}>Skriv ut</button>
    )

}

export default GeneratePdf;