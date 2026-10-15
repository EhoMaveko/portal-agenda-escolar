<?php

namespace App\Jobs;

use App\Models\Agenda;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class GerarResumoDsa implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $agendas = Agenda::with('respostas', 'perfil')->get();

        $resumo = "RELATÓRIO DE AGENDAS - DSA\n\n";

        foreach ($agendas as $agenda) {
            $resumo .= "Título: " . $agenda->titulo . "\n";
            $resumo .= "Perfil: " . $agenda->perfil->nome . "\n";
            $resumo .= "Data: " . $agenda->data_evento->format('d/m/Y H:i') . "\n";
            $resumo .= "Status: " . $agenda->status . "\n";
            $resumo .= "Quantidade de respostas: " . $agenda->respostas->count() . "\n";
            $resumo .= "-----------------------------\n";
        }

        Storage::disk('s3')->put(
            'relatorios/resumo-dsa.txt',
            $resumo
        );
    }
}
