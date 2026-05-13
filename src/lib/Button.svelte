<script>
  let {children, func = () => {}, type = "button", ariaLabel = "", class: className} = $props()
</script>

<button 
  onclick={func}
  type={type}
  aria-label={ariaLabel}
  class={`
    cursor-pointer shadow px-3 py-2 
    bg-soft-linen-100 
    border-soft-linen-300 rounded-[99999px] border
    text-dusk-blue-800 
    hover:bg-soft-linen-200 
    active:scale-95	
    transition-all ${className}`}> 
  {@render children?.()}
</button>