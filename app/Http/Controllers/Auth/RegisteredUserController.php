<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use \Mailjet\Resources;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;


class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $emailToken = $this->emailTokenGenerate();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_token' => $emailToken,
        ]);

        // add to pelanggan
        Pelanggan::create([
            'user_id' => $user->id,
            'nama' => $user->name,
            'email' => $user->email,
            'alamat' => $request->alamat,
            'NIK' => $request->nik,
            'no_telp' => $request->no_telp,
        ]);

        // email verif with mailjet
        $this->sendEmailVerif($request->email, $request->name, $emailToken);

        return redirect(route('dashboard', absolute: false));
    }

    public function sendEmailVerif($email, $name, $emailToken)
    {
        // Construct the verification URL
        $url = "http://localhost:8082/email/verification?email_token=$emailToken";

        // Prepare the cURL request
        $curl = curl_init();

        // Set up the cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://api.mailjet.com/v3.1/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode([
                'Messages' => [
                    [
                        'From' => [
                            'Email' => 'iyalshariar@gmail.com',
                            'Name' => 'System Elib The Room'
                        ],
                        'To' => [
                            [
                                'Email' => $email,
                                'Name' => $name
                            ]
                        ],
                        'Subject' => 'Email Verification - System Elib The Room',
                        'TextPart' => "Dear $name, please verify your email by clicking the link below.",
                        'HTMLPart' => "
                        <h3>Hello $name,</h3>
                        <p>Thank you for registering with <strong>System Elib The Room</strong>! Please verify your email address by clicking the link below:</p>
                        <p><a href='$url' style='color: #4CAF50;'>Verify My Email</a></p>
                        <p>If you didn't create an account with us, please ignore this email.</p>
                        <br />
                        <p>Best regards,<br/>System Elib The Room Team</p>
                    "
                    ]
                ]
            ]),
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode(env('MAILJET_API_KEY') . ':' . env('MAILJET_SECRET_KEY'))
            ),
        ));

        // Execute the cURL request and capture the response
        $response = curl_exec($curl);

        // Close the cURL session
        curl_close($curl);

        // Return the response
        return $response;
    }



    public function emailTokenGenerate()
    {
        $token = bin2hex(random_bytes(32));
        return $token;
    }

    public function getEmailVerif()
    {
        // get from query param email_token
        $emailToken = request()->query('email_token');
        $user = User::where('email_token', $emailToken)->first();

        if ($user) {
            $user->update([
                'email_verified_at' => now(),
                'email_token' => null,
            ]);
            event(new Registered($user));

            Auth::login($user);
            return redirect(route('dashboard', absolute: false));
        }

        return redirect(route('login', absolute: false));
    }
}
