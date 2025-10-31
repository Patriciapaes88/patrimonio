// Lista principal
const listaPatrimonios = [];
// Salva no armazenamento local
function salvarNoLocalStorage() {
  localStorage.setItem("patrimonios", JSON.stringify(listaPatrimonios));
}
// Preenche os anos nos selects
export function preencherMesAno() {
  const selectAnoFiltro = document.getElementById("ano-filtro");
  const selectAnoFormulario = document.getElementById("ano-formulario");
  const anoAtual = new Date().getFullYear();

  for (let ano = anoAtual; ano >= 2020; ano--) {
    const optionFiltro = document.createElement("option");
    optionFiltro.value = ano;
    optionFiltro.textContent = ano;
    selectAnoFiltro.appendChild(optionFiltro);

    const optionFormulario = document.createElement("option");
    optionFormulario.value = ano;
    optionFormulario.textContent = ano;
    selectAnoFormulario.appendChild(optionFormulario);
  }

  selectAnoFormulario.value = String(anoAtual);
  selectAnoFiltro.value = String(anoAtual);
}

// Ativa o formulário de cadastro
export function ativarFormulario() {
  const form = document.getElementById("form-patrimonio");
  const setorFormulario = document.getElementById("setor-formulario");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
   

    const dados = {
      numero: form.patrimonio.value.trim(),
      nome: form.nome.value.trim(),
      presente: form.presente.value.trim(),
      quantidade: form.quantidade.value.trim(),
      estado: form.estado.value.trim(),
      ano: form.ano.value.trim(),
      local: setorFormulario.value
    };

    // Sempre salva localmente
    listaPatrimonios.push(dados);
    salvarNoLocalStorage();
    exibirTabelaFiltrada();

    // ✅ Só envia para Supabase se tiver internet
    if (navigator.onLine) {
      salvarNoSupabase(dados);
    } else {
      console.warn("⛔ Sem internet, salvando só localmente");
    }

    form.reset();
    form.patrimonio.focus();
    setorFormulario.value = dados.local;
  });
}




// Exibe a tabela filtrada
export function exibirTabelaFiltrada() {
  const anoSelecionado = document.getElementById("ano-filtro").value;
  const setorSelecionado = document.getElementById("filtro-setor").value;
  const corpoTabela = document.getElementById("corpo-tabela");

  corpoTabela.innerHTML = "";

  const filtrados = listaPatrimonios.filter(p => String(p.ano) === String(anoSelecionado));


  if (setorSelecionado === "__todos__") {
    const setoresUnicos = [...new Set(filtrados.map(p => p.local))];
    setoresUnicos.forEach(setor => {
      const grupo = filtrados.filter(p => p.local === setor);
      const subtitulo = document.createElement("tr");
      subtitulo.innerHTML = `<td colspan="8" style="background:#eee;font-weight:bold;text-align:left;">📌 ${setor}</td>`;
      corpoTabela.appendChild(subtitulo);
      grupo.forEach(dados => adicionarLinhaTabela(dados, corpoTabela));
    });
  } else {

    const grupoFiltrado = filtrados.filter(p => p.local.toLowerCase() === setorSelecionado.toLowerCase());

    grupoFiltrado.forEach(dados => adicionarLinhaTabela(dados, corpoTabela));
  }
}

// Adiciona uma linha na tabela
function adicionarLinhaTabela(dados, corpoTabela) {
  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td>${dados.numero}</td>
    <td>${dados.nome}</td>
    <td>${dados.presente}</td>
    <td>${dados.quantidade}</td>
    <td>${dados.estado}</td>
    <td>${dados.local}</td>
    <td>${dados.ano}</td>
    <td><button class="btn-editar">✏️</button> 
    <button class="btn-excluir">❌</button></td>
  `;
  corpoTabela.appendChild(linha);

  // Editar
  linha.querySelector(".btn-editar").addEventListener("click", () => {
    const celulas = linha.querySelectorAll("td");
    const campos = ["numero", "nome", "presente", "quantidade", "estado", "local", "ano"];
    campos.forEach((campo, i) => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = dados[campo];
      input.style.width = "100%";
      celulas[i].textContent = "";
      celulas[i].appendChild(input);
    });

    const btns = celulas[7];
    btns.innerHTML = '<button class="btn-salvar" title="Clique para salvar alteração 💾">💾</button>';

    const btnSalvar = btns.querySelector(".btn-salvar");
    btnSalvar.addEventListener("click", () => {
      campos.forEach((campo, i) => {
        const novoValor = celulas[i].querySelector("input").value.trim();
        dados[campo] = novoValor;
      });

      salvarNoLocalStorage();
      exibirTabelaFiltrada();
    });
  });

  // Excluir
  linha.querySelector(".btn-excluir").addEventListener("click", () => {
    const confirmar = confirm("Tem certeza que deseja excluir este patrimônio?");
    if (confirmar) {
      const index = listaPatrimonios.indexOf(dados);
      if (index > -1) {
        listaPatrimonios.splice(index, 1);
        salvarNoLocalStorage();
        exibirTabelaFiltrada();
      }
    }
  });
}

// Exporta para Excel
document.getElementById("exportar-xlsx").addEventListener("click", () => {
  const anoSelecionado = document.getElementById("ano-filtro").value;

  const setorSelecionado = document.getElementById("filtro-setor").value;
const filtrados = listaPatrimonios.filter(p => {
  const mesmoAno = String(p.ano) === String(anoSelecionado);
 const mesmoSetor = setorSelecionado === "__todos__" || p.local.toLowerCase() === setorSelecionado.toLowerCase();

  return mesmoAno && mesmoSetor;
});

  if (filtrados.length === 0) {
    alert("Não há registros para exportar neste período.");
    return;
  }

  const cabecalho = ["Número", "Nome", "Presente", "Quantidade", "Estado", "Local", "Ano"];
  const dados = filtrados.map(p => [
    String(p.numero).trim(),
    String(p.nome).trim(),
    String(p.presente).trim(),
    Number(p.quantidade) > 0 ? p.quantidade : "",
    String(p.estado).trim(),
    String(p.local).trim(),
    String(p.ano).trim()
  ]);

  const ws = XLSX.utils.aoa_to_sheet([cabecalho, ...dados]);
  ws['!cols'] = [
    { wch: 12 }, { wch: 25 }, { wch: 10 },
    { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 10 }
  ];

  Object.keys(ws).forEach(cell => {
    if (!ws[cell] || cell === '!ref') return;
    const isHeader = cell.match(/[A-Z]1/);
    ws[cell].s = {
      font: { name: "Segoe UI", sz: 11, bold: !!isHeader },
      alignment: { wrapText: true, vertical: "center", horizontal: "center" },
      fill: isHeader ? { fgColor: { rgb: "D9D2E9" } } : undefined,
      border: {
        top: { style: "thin", color: { rgb: "999999" } },
        bottom: { style: "thin", color: { rgb: "999999" } },
        left: { style: "thin", color: { rgb: "999999" } },
        right: { style: "thin", color: { rgb: "999999" } }
      }
    };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Patrimônios");
  XLSX.writeFile(wb, `patrimonios-${anoSelecionado}.xlsx`);
});

// Copia dados do ano anterior
export function copiarAnoAnterior() {
  const anoAtual = parseInt(document.getElementById("ano-filtro").value);
  const anoAnterior = String(anoAtual - 1);

  const anteriores = listaPatrimonios.filter(p => p.ano === anoAnterior);

  if (anteriores.length === 0) {
    alert(`Nenhum patrimônio encontrado para o ano ${anoAnterior}.`);
    return;
  }

  const copiados = anteriores.map(p => ({
    ...p,
    ano: String(anoAtual)
  }));

  listaPatrimonios.push(...copiados);
  salvarNoLocalStorage();
  exibirTabelaFiltrada();
  alert(`Foram copiados ${copiados.length} patrimônios de ${anoAnterior}.`);
}
const SUPABASE_URL = "https://dklkrryzawlyvtvedlec.supabase.co"; // substitua pela sua
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGtycnl6YXdseXZ0dmVkbGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjcxNDgsImV4cCI6MjA3NzQ0MzE0OH0.rOIaksjWxgBud1NKa5AYCVenVqD6_lC0IvlSO_0fPtw"; // substitua pela sua


//salvaNoSupabase
async function salvarNoSupabase(dados) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/patrimonios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify([dados])
    });

    const texto = await res.text();

    if (!res.ok) {
      console.error("❌ Erro ao salvar :", res.status, texto);
      alert("Erro ao salvar : " + texto);
      return;
    }

    const resultado = JSON.parse(texto);
    console.log("✅ Enviado :", resultado);
    alert("✅ Patrimônio salvo com sucesso!");
    buscarPatrimonios(); // recarrega a tabela após salvar
  } catch (e) {
    console.error("⚠️  Patrimônio salvo localmente. Será sincronizado quando a conexão voltar. :", e);
    alert(" Patrimônio salvo localmente. Será sincronizado quando a conexão voltar. .");
  }
}

 export function sincronizarComSupabase() {
  if (!navigator.onLine) return;

  const salvos = JSON.parse(localStorage.getItem("patrimonios") || "[]");
  if (salvos.length === 0) return;

  console.log("🌐 Sincronizando ...");

  salvos.forEach(dados => {
    salvarNoSupabase(dados);
  });

  localStorage.removeItem("patrimonios");
  alert("✅ Dados locais foram sincronizados.");
}

window.addEventListener("online", sincronizarComSupabase);


export async function buscarPatrimonios() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/patrimonios?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const dados = await res.json();
  console.log(" Patrimônios carregados:", dados);

  listaPatrimonios.length = 0;       // limpa a lista local
  listaPatrimonios.push(...dados);   // preenche com dados do Supabase
  exibirTabelaFiltrada();            // atualiza a tabela na tela
}
