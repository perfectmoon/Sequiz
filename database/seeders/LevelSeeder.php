<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Level;
use App\Models\Hint;

class LevelSeeder extends Seeder
{
    public function run()
    {
        // Level 1
        $level1 = Level::create([
            'level_number' => 1,
            'title' => 'The Hidden Message',
            'description' => 'Find the hidden password in this page. Look for comments in the HTML source.',
            'difficulty' => 'Very Easy',
            'category' => 'Web',
            'validation_type' => 'exact',
            'expected_answer' => 'first_step',
            'points_awarded' => 100,
            'time_estimate' => '2-5 min',
            'next_level' => 2,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level1->id,
            'hint_text' => 'Look for text ending with "==" in HTML comments',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        Hint::create([
            'level_id' => $level1->id,
            'hint_text' => 'Use atob() in the console to decode base64',
            'cost' => 10,
            'order' => 2,
            'is_ai_generated' => false
        ]);

        // Level 2
        $level2 = Level::create([
            'level_number' => 2,
            'title' => 'CSS Secrets',
            'description' => 'The password is hidden in the CSS. Check color values carefully.',
            'difficulty' => 'Easy',
            'category' => 'Web',
            'validation_type' => 'exact',
            'expected_answer' => 'console_master',
            'points_awarded' => 150,
            'time_estimate' => '5-10 min',
            'next_level' => 3,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level2->id,
            'hint_text' => 'Look at hex color values in the CSS',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        // Level 3
        $level3 = Level::create([
            'level_number' => 3,
            'title' => 'Console Chronicles',
            'description' => 'Use terminal commands to decode the hidden message.',
            'difficulty' => 'Easy',
            'category' => 'Web',
            'validation_type' => 'exact',
            'expected_answer' => 'network_ninja',
            'points_awarded' => 150,
            'time_estimate' => '5-10 min',
            'next_level' => 4,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level3->id,
            'hint_text' => 'Try scanning the page first with the scan command',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        // Level 4
        $level4 = Level::create([
            'level_number' => 4,
            'title' => 'Storage Heist',
            'description' => 'Retrieve data from browser storage: sessionStorage, localStorage, and cookies.',
            'difficulty' => 'Medium',
            'category' => 'Web',
            'validation_type' => 'exact',
            'expected_answer' => 'crypto_expert',
            'points_awarded' => 200,
            'time_estimate' => '10-15 min',
            'next_level' => 5,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level4->id,
            'hint_text' => 'Check the Application tab in DevTools',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        Hint::create([
            'level_id' => $level4->id,
            'hint_text' => 'Decode each part and combine them',
            'cost' => 10,
            'order' => 2,
            'is_ai_generated' => false
        ]);

        // Level 5
        $level5 = Level::create([
            'level_number' => 5,
            'title' => 'XOR Encryption',
            'description' => 'Decrypt the message using XOR with the given key.',
            'difficulty' => 'Medium',
            'category' => 'Crypto',
            'validation_type' => 'exact',
            'expected_answer' => 'binary_code',
            'points_awarded' => 200,
            'time_estimate' => '10-15 min',
            'next_level' => 6,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level5->id,
            'hint_text' => 'Use the XOR decoder tool on the page',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        // Level 6
        $level6 = Level::create([
            'level_number' => 6,
            'title' => 'Multi-Layer Obfuscation',
            'description' => 'Decode multiple layers of encoding to find the password.',
            'difficulty' => 'Hard',
            'category' => 'Web',
            'validation_type' => 'exact',
            'expected_answer' => 'h4cex53c_perl_research_character_the_final_puzzle',
            'points_awarded' => 250,
            'time_estimate' => '15-20 min',
            'next_level' => 7,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level6->id,
            'hint_text' => 'All 4 layers are encoded differently - find where each is stored',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        Hint::create([
            'level_id' => $level6->id,
            'hint_text' => 'Check CSS, JavaScript, localStorage, and cookies',
            'cost' => 10,
            'order' => 2,
            'is_ai_generated' => false
        ]);

        // Level 7
        $level7 = Level::create([
            'level_number' => 7,
            'title' => 'The Meta Puzzle',
            'description' => 'The ultimate challenge. Combine all skills learned and decode the final password.',
            'difficulty' => 'Very Hard',
            'category' => 'Meta',
            'validation_type' => 'exact',
            'expected_answer' => 'glad_its_over_puzzle_password_is_made_of_the_past',
            'points_awarded' => 300,
            'time_estimate' => '20+ min',
            'next_level' => null,
            'is_active' => true
        ]);

        Hint::create([
            'level_id' => $level7->id,
            'hint_text' => 'Decode the binary message from the background',
            'cost' => 5,
            'order' => 1,
            'is_ai_generated' => false
        ]);

        Hint::create([
            'level_id' => $level7->id,
            'hint_text' => 'Type finalHint(); in the console for additional guidance',
            'cost' => 10,
            'order' => 2,
            'is_ai_generated' => false
        ]);
    }
}
