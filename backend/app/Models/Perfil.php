<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    protected $table = 'perfis';

    protected $fillable = [
        'nome',
        'tipo',
    ];

    public function agendas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
    return $this->hasMany(Agenda::class);
    }

}
