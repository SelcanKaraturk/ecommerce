<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyEmailTR extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
         $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('E-posta Adresinizi Doğrulayın')
            ->greeting('Merhaba ' . $notifiable->name . ',')
            ->line('Sitemize kayıt olduğunuz için teşekkür ederiz!')
            ->line('E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:')
            ->action('E-posta Adresimi Doğrula', $verificationUrl)
            ->line('Bu bağlantı ' . config('auth.verification.expire', 60) . ' dakika içinde geçerliliğini yitirecektir.')
            ->line('Eğer bu işlemi siz yapmadıysanız, herhangi bir işlem yapmanıza gerek yoktur.');
    }

     protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
