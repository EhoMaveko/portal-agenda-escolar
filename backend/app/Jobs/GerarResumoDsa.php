<?php

namespace App\Jobs;

use App\Models\Agenda;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use RuntimeException;
use Throwable;

class GerarResumoDsa implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $relatorioId
    ) {}

    public function handle(): void
    {
        Cache::put("relatorio:{$this->relatorioId}", [
            'status' => 'processando',
        ], now()->addMinutes(30));

        $agendas = Agenda::with('respostas', 'perfil')->get();

        $resumo = "RELATÓRIO DE AGENDAS - DSA\n\n";

        foreach ($agendas as $agenda) {
            $resumo .= "Título: " . $agenda->titulo . "\n";
            $resumo .= "Perfil: " . ($agenda->perfil->nome ?? 'Não informado') . "\n";
            $resumo .= "Data: " . $agenda->data_evento->format('d/m/Y H:i') . "\n";
            $resumo .= "Status: " . $agenda->status . "\n";
            $resumo .= "Quantidade de respostas: " . $agenda->respostas->count() . "\n";
            $resumo .= "-----------------------------\n";
        }

        $caminho = "relatorios/resumo-dsa-{$this->relatorioId}.txt";

        $salvo = Storage::disk('s3')->put($caminho, $resumo);

        if (!$salvo) {
            throw new RuntimeException('Não foi possível salvar o relatório no MinIO.');
        }

        Cache::put("relatorio:{$this->relatorioId}", [
            'status' => 'concluido',
            'caminho' => $caminho,
        ], now()->addMinutes(30));
    }

    public function failed(?Throwable $exception): void
    {
        Cache::put("relatorio:{$this->relatorioId}", [
            'status' => 'erro',
        ], now()->addMinutes(30));
    }
}
