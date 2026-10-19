<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class EnsureMinioBucket extends Command
{
    protected $signature = 'minio:ensure-bucket';

    protected $description = 'Garante que o bucket de arquivos exista no MinIO';

    public function handle(): int
    {
        $disk = Storage::disk('s3');
        $bucket = config('filesystems.disks.s3.bucket');

        if (!$bucket) {
            $this->error('O bucket S3 não está configurado.');
            return self::FAILURE;
        }

        $client = $disk->getClient();

        if ($client->doesBucketExist($bucket)) {
            $this->info("O bucket {$bucket} já existe.");
            return self::SUCCESS;
        }

        $client->createBucket([
            'Bucket' => $bucket,
        ]);

        $this->info("O bucket {$bucket} foi criado.");
        return self::SUCCESS;
    }
}
