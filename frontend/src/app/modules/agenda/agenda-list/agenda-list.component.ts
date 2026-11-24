
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { COMMONS_MODULES } from '../../../shared';
import { ListAgendaComponent } from '../components/agenda-list/list-agenda.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Agenda as AgendaLista } from '../components/agenda-list/list-agenda.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';


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
  imports: [COMMONS_MODULES, ListAgendaComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './agenda-list.component.html',
})
export class AgendaListComponent implements OnInit {

  protected agendas: Agenda[] = [];
  protected carregando = true;

  protected erro = '';
  protected excluindoAgendaId: number | null = null;

  protected perfis: { id: number; nome: string; tipo: string }[] = [];

  protected novoTitulo = '';
  protected novaDescricao = '';
  protected novaDataEvento = '';
  protected novoPerfilId = 1;

  protected salvando = false;
  protected mensagem = '';

  protected agendaSelecionadaId: number | null = null;
  protected respostas: Resposta[] = [];

  protected formulario = new FormGroup({
    nomeAluno: new FormControl('', {

      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/.*\S.*/), Validators.minLength(3)],
    }),
    comentarioResposta: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/.*\S.*/)]
    }),
    arquivoSelecionado: new FormControl<File | null>(null)
  });

  protected get nomeAluno(): string {
    return this.formulario.controls.nomeAluno.value;
  }

  protected set nomeAluno(valor: string) {
    this.formulario.controls.nomeAluno.setValue(valor);
  }

  protected get comentarioResposta(): string {
    return this.formulario.controls.comentarioResposta.value;
  }

  protected set comentarioResposta(valor: string) {
    this.formulario.controls.comentarioResposta.setValue(valor);
  }

  protected get arquivoSelecionado(): File | null {
    return this.formulario.controls.arquivoSelecionado.value;
  }

  protected set arquivoSelecionado(valor: File | null) {
    this.formulario.controls.arquivoSelecionado.setValue(valor);
  }


  protected carregandoRespostas = false;
  protected enviandoResposta = false;
  protected mensagemResposta = '';

  protected solicitandoRelatorio = false;
  protected mensagemRelatorio = '';
  protected erroRelatorio = false;

  protected formatoData = 'dd/MM/yyyy HH:mm';

  private readonly http: HttpClient;
  private readonly translate: TranslateService;

  constructor(http: HttpClient, translate: TranslateService) {
    this.http = http;
    this.translate = translate;

    this.onAtualizarFormatoData();

    this.translate.onLangChange.subscribe(() => {
      this.onAtualizarFormatoData();
    });
  }

  public onAtualizarFormatoData(): void {
    const idioma = this.translate.currentLang();

    this.formatoData =
      idioma === 'en'
        ? 'MM/dd/yyyy hh:mm a'
        : 'dd/MM/yyyy HH:mm';
  }

  public onObterErroNome(campo: AbstractControl): string | null {
  if (campo.hasError('required')) {
    return 'enviarResposta.nome-obrigatorio';
  }

  if (campo.hasError('minlength')) {
    return 'enviarResposta.nome-minimo';
  }

  return null;
}

  public onObterErroComentario(campo: AbstractControl): string | null {
  if (campo.hasError('required')) {
    return 'enviarResposta.comentario-obrigatorio';
  }

  return null;
}

  public ngOnInit(): void {
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
      next: (dados) => {
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

  public onCadastrarAgenda(dados?: {
    titulo: string;
    descricao: string;
    dataEvento: string;
    perfilId: number;
  }): void {
    this.mensagem = '';

    const titulo = dados?.titulo ?? this.novoTitulo.trim();
    const descricao = dados?.descricao ?? this.novaDescricao.trim();
    const dataEvento = dados?.dataEvento ?? this.novaDataEvento;
    const perfilId = dados?.perfilId ?? this.novoPerfilId;

    if (!titulo || !dataEvento || !perfilId) {
      this.mensagem = 'Preencha o título, a data e o perfil.';
      return;
    }

    this.salvando = true;

    const novaAgenda = {
      perfil_id: perfilId,
      titulo,
      descricao,
      data_evento: dataEvento,
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

  public onSelecionarAgenda(agendaId: number): void {
    this.agendaSelecionadaId = agendaId;
    this.respostas = [];
    this.mensagemResposta = '';
    this.nomeAluno = '';
    this.comentarioResposta = '';
    this.arquivoSelecionado = null;
    this.carregarRespostas(agendaId);
  }

  public onExcluirAgenda(agenda: AgendaLista): void {
    const confirmacao = this.translate.instant('listaDeAgendas.confirmarExclusao', {
      titulo: agenda.titulo,
    });

    if (!window.confirm(confirmacao) || this.excluindoAgendaId !== null) {
      return;
    }

    this.excluindoAgendaId = agenda.id;

    this.http.delete<void>(`http://localhost:8000/api/agendas/${agenda.id}`).subscribe({
      next: () => {
        this.agendas = this.agendas.filter((item) => item.id !== agenda.id);

        if (this.agendaSelecionadaId === agenda.id) {
          this.agendaSelecionadaId = null;
          this.respostas = [];
        }

        this.excluindoAgendaId = null;
      },
      error: (erro) => {
        console.error('Erro ao excluir agenda:', erro);
        window.alert(this.translate.instant('listaDeAgendas.erroExclusao'));
        this.excluindoAgendaId = null;
      },
    });
  }

  private carregarRespostas(agendaId: number): void {
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

  public onArquivoSelecionado(event: Event): void {
    const campo = event.target as HTMLInputElement;
    this.arquivoSelecionado = campo.files?.[0] ?? null;
  }


public onEnviarResposta(): void {
  this.mensagemResposta = '';

  this.formulario.markAllAsDirty();
  this.formulario.markAllAsTouched();

  alert(this.translate.instant('criarAgenda.campos-invalidos'));

  if (this.agendaSelecionadaId === null) {
    this.mensagemResposta = 'Selecione uma agenda.';
    return;
  }

  if (this.formulario.invalid) {
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

      this.formulario.reset({
        nomeAluno: '',
        comentarioResposta: '',
        arquivoSelecionado: null
      });

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

}
