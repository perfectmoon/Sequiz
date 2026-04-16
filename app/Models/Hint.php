<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hint extends Model
{
    use HasFactory;
    protected $connection = 'mysql';

    protected $fillable = [
        'level_id',
        'hint_text',
        'cost',
        'is_ai_generated',
        'order',
        'hint_number',
        'prerequisites'
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'is_ai_generated' => 'boolean'
    ];

    public function getOrderAttribute($value)
    {
        return $value ?? $this->attributes['hint_number'] ?? null;
    }

    public function getHintNumberAttribute($value)
    {
        return $value ?? $this->attributes['order'] ?? null;
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function isAvailable($userProgress)
    {
        if (!$this->prerequisites) {
            return true;
        }
        
        // Check if user meets prerequisites
        foreach ($this->prerequisites as $prereq) {
            if (!in_array($prereq, $userProgress->completed_levels ?? [])) {
                return false;
            }
        }
        
        return true;
    }
}
