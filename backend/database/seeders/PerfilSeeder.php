<?php

namespace Database\Seeders;

use App\Models\Perfil;
use Illuminate\Database\Seeder;

class PerfilSeeder extends Seeder
{
    public function run(): void
    {
        $perfis = [
            ['tipo' => 'escola', 'nome' => 'Colégio Adventista de Tatuí'],
            ['tipo' => 'campo', 'nome' => 'Associação Paulista Sudoeste'],
            ['tipo' => 'uniao', 'nome' => 'União Central Brasileira'],
            ['tipo' => 'dsa', 'nome' => 'Divisão Sul-Americana (DSA)'],
        ];

        foreach ($perfis as $dados) {
            Perfil::updateOrCreate(
                ['tipo' => $dados['tipo']],
                ['nome' => $dados['nome']]
            );
        }
    }
}
