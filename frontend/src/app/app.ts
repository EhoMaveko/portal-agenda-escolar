import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

interface Agenda {
  id: number;
  perfil_id: number;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  status: string;
}

interface Resposta {
  id: number;
  agenda_id: number;
  aluno_nome: string;
  comentario: string | null;
  arquivo_path: string | null;
  created_at: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  agendas: Agenda[] = [];
  carregando = true;
  erro = '';

  perfis: { id: number; nome: string; tipo: string }[] = [];

  novoTitulo = '';
  novaDescricao = '';
  novaDataEvento = '';
  novoPerfilId = 1;

  salvando = false;
  mensagem = '';

  agendaSelecionadaId: number | null = null;
  respostas: Resposta[] = [];

  nomeAluno = '';
  comentarioResposta = '';
  arquivoSelecionado: File | null = null;

  carregandoRespostas = false;
  enviandoResposta = false;
  mensagemResposta = '';

  solicitandoRelatorio = false;
  mensagemRelatorio = '';
  erroRelatorio = false;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Agenda[]>('http://localhost:8000/api/agendas')
      .subscribe({
        next: (dados) => {
          this.agendas = dados;
          this.carregando = false;
        },
        error: (erro) => {
          console.error('Erro ao buscar agendas:', erro);
          this.erro = 'Não foi possível carregar as agendas.';
          this.carregando = false;
        }
      });

    this.http.get<{ id: number; nome: string; tipo: string }[]>(
      'http://localhost:8000/api/perfis'
    ).subscribe({
      next: (dados: { id: number; nome: string; tipo: string }[]) => {
        this.perfis = dados;

        if (dados.length > 0) {
          this.novoPerfilId = dados[0].id;
        }
      },
      error: (erro) => {
        console.error('Erro ao buscar perfis:', erro);
      }
    });
  }

      cadastrarAgenda(): void {
      this.mensagem = '';

      if (
        !this.novoTitulo.trim() ||
        !this.novaDataEvento ||
        !this.novoPerfilId
      ) {
        this.mensagem = 'Preencha o título, a data e o perfil.';
        return;
      }

      this.salvando = true;

      const novaAgenda = {
        perfil_id: this.novoPerfilId,
        titulo: this.novoTitulo.trim(),
        descricao: this.novaDescricao.trim(),
        data_evento: this.novaDataEvento,
        status: 'ativo'
      };

      this.http.post<Agenda>(
        'http://localhost:8000/api/agendas',
        novaAgenda
      ).subscribe({
        next: (agendaCriada) => {
          this.agendas.push(agendaCriada);

          this.novoTitulo = '';
          this.novaDescricao = '';
          this.novaDataEvento = '';

          this.mensagem = 'Agenda cadastrada com sucesso!';
          this.salvando = false;
        },
        error: (erro) => {
          console.error('Erro ao cadastrar agenda:', erro);

          this.mensagem = 'Não foi possível cadastrar a agenda.';
          this.salvando = false;
        }
      });
    }


  selecionarAgenda(agendaId: number): void {
    this.agendaSelecionadaId = agendaId;
    this.respostas = [];
    this.mensagemResposta = '';
    this.nomeAluno = '';
    this.comentarioResposta = '';
    this.arquivoSelecionado = null;
    this.carregarRespostas(agendaId);
  }

  carregarRespostas(agendaId: number): void {
    this.carregandoRespostas = true;

    this.http.get<Resposta[]>(
      `http://localhost:8000/api/agendas/${agendaId}/respostas`
    ).subscribe({
      next: (dados) => {
        this.respostas = dados;
        this.carregandoRespostas = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar respostas:', erro);
        this.mensagemResposta = 'Não foi possível carregar as respostas.';
        this.carregandoRespostas = false;
      }
    });
  }

  onArquivoSelecionado(event: Event): void {
    const campo = event.target as HTMLInputElement;
    this.arquivoSelecionado = campo.files?.[0] ?? null;
  }

  enviarResposta(): void {
    this.mensagemResposta = '';

    if (this.agendaSelecionadaId === null) {
      this.mensagemResposta = 'Selecione uma agenda.';
      return;
    }

    if (!this.nomeAluno.trim()) {
      this.mensagemResposta = 'Informe o nome do aluno.';
      return;
    }

    const dados = new FormData();
    dados.append('aluno_nome', this.nomeAluno.trim());
    dados.append('comentario', this.comentarioResposta.trim());

    if (this.arquivoSelecionado) {
      dados.append('arquivo', this.arquivoSelecionado);
    }

    this.enviandoResposta = true;

    this.http.post<Resposta>(
      `http://localhost:8000/api/agendas/${this.agendaSelecionadaId}/respostas`,
      dados
    ).subscribe({
      next: () => {
        const agendaId = this.agendaSelecionadaId!;

        this.nomeAluno = '';
        this.comentarioResposta = '';
        this.arquivoSelecionado = null;

        this.mensagemResposta = 'Resposta enviada com sucesso!';
        this.carregarRespostas(agendaId);
        this.enviandoResposta = false;
      },
      error: (erro) => {
        console.error('Erro ao enviar resposta:', erro);

        if (erro.status === 422) {
          this.mensagemResposta =
            'Confira os campos preenchidos e o tamanho do arquivo (máximo 10 MB).';
        } else {
          this.mensagemResposta =
            'Não foi possível enviar a resposta. Tente novamente.';
        }

        this.enviandoResposta = false;
      }
    });
  }

  solicitarResumoDsa(): void {
    this.solicitandoRelatorio = true;
    this.mensagemRelatorio = '';
    this.erroRelatorio = false;

    this.http.post<{ mensagem: string }>(
      'http://localhost:8000/api/relatorios/solicitar-resumo-dsa',
      {}
    ).subscribe({
      next: (resposta: { mensagem: string }) => {
        this.mensagemRelatorio = resposta.mensagem;
        this.solicitandoRelatorio = false;
      },
      error: (erro: { erro: string }) => {
        console.error('Erro ao solicitar relatório:', erro);

        this.mensagemRelatorio =
          'Não foi possível solicitar o relatório. Tente novamente.';

        this.erroRelatorio = true;
        this.solicitandoRelatorio = false;
      }
    });
  }
}
