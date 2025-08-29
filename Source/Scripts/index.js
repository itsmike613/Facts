const $ = id => document.getElementById(id);
const elements = ["fact","category","counter","prev","next","copy","theme","categorySelect","random"].reduce((a,id)=>(a[id]=$.call(null,id),a),{});

let index=0, filtered=[];

fetch("Source/Data/index.json").then(res => res.json()).then(facts => {
    filtered = [...facts];

    elements.categorySelect.innerHTML = ["All", ...new Set(facts.map(f=>f.category))].map(c=>`<option value="${c}">${c}</option>`).join("");

    const showFact = () => {
        const f = filtered[index];
        elements.fact.textContent = f.text;
        elements.category.textContent = `#${f.category}`;
        elements.counter.textContent = `Fact ${index+1} of ${filtered.length}`;
    };

    elements.prev.onclick = () => { index=(index-1+filtered.length)%filtered.length; showFact(); };
    elements.next.onclick = () => { index=(index+1)%filtered.length; showFact(); };
    elements.random.onclick = () => { index=Math.floor(Math.random()*filtered.length); showFact(); };
    elements.copy.onclick = async () => { 
        await navigator.clipboard.writeText(filtered[index].text);
        elements.copy.innerHTML='<i class="ph ph-check-square"></i>';
        setTimeout(()=>elements.copy.innerHTML='<i class="ph ph-copy"></i>',1000);
    };
    elements.theme.onclick = () => document.body.classList.toggle("light");
    elements.categorySelect.onchange = () => {
        const val = elements.categorySelect.value;
        filtered = val==="All"?[...facts]:facts.filter(f=>f.category===val);
        index=0; showFact();
    };

    showFact();
});