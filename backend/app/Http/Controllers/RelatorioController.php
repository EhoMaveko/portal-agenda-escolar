<?php
namespace App\Http\Controllers;

use App\Jobs\GerarResumoDsa;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RelatorioController extends Controller
{
    public function solicitarResumoDsa()
    {
        $id = (string) Str::uuid();

        Cache::put("relatorio:{$id}", [
            'status' => 'aguardando',
        ], now()->addMinutes(30));

        GerarResumoDsa::dispatch($id);

        return response()->json([
            'mensagem' => 'Relatório solicitado com sucesso.',
            'id' => $id,
        ], 202);
    }

    public function consultarResumoDsa(string $id)
    {
        $relatorio = Cache::get("relatorio:{$id}");

        if (!$relatorio) {
            return response()->json([
                'erro' => 'Relatório não encontrado ou expirado.'
            ], 404);
        }

        if ($relatorio['status'] !== 'concluido') {
            return response()->json([
                'status' => $relatorio['status']
            ]);
        }

        $url = Storage::disk('s3_public')->temporaryUrl(
            $relatorio["caminho"],
            now()->addMinutes(5),
            [
                'ResponseContentDisposition' =>
                    'attachment; filename="resumo-dsa.txt"',
            ]
        );

        $url = str_replace(
            'http://minio:9002',
            'http://localhost:9002',
                $url
        );

        return response()->json([
            'status' => 'concluido',
            'url_download' => $url
        ]);
    }
}
