<?php /** @var \Galahad\Aire\Elements\Attributes\Attributes $attributes */ ?>
<?php /** @var \Illuminate\Support\ViewErrorBag $errors */ ?>


@if ($errors->any())
	
	<div class="{{ $class }}">
		
		{{ trans_choice('aire::common.summary', $errors->count()) }}
		
		@if($verbose)
			
			<ul class="pt-4">
				@foreach ($errors->all() as $error)
					<li>{{ $error }}</li>
				@endforeach
			</ul>
			
		@endif
	</div>
	
@endif
