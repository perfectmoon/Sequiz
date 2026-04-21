<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $connection = 'mysql';
    protected $fillable = [
        'level_number', 'title', 'description', 'difficulty', 
        'category', 'initial_data', 'validation_type', 
        'expected_answer', 'points_awarded', 'time_estimate',
        'next_level', 'resources', 'is_active'
    ];
    
    public function getPasswordAttribute()
    {
        return $this->expected_answer;
    }
    
    public function hints()
    {
        return $this->hasMany(Hint::class, 'level_number', 'level_number');
    }
}   
