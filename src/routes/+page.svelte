<script>
  import { resolve } from "$app/paths";
</script>
<div class="fixed inset-0 flex justify-center items-center flex-col gap-4">
  <a class="btn-primary" href={resolve("/account")}>To account</a>
  <a class="btn-primary" href={resolve("/dashboard")}>To dashboard</a>
</div>