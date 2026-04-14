<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category',
        'total_questions',
        'score',
    ];

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
