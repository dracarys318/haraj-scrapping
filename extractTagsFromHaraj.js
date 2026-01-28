(async function () {
  // ================================
  // Helper: Sleep Function
  // ================================
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // ================================
  // Final JSON Output
  // ================================
  const result = [];

  // ================================
  // Get All Main Categories Links
  // ================================
  const mainLinks = Array.from(
    document.querySelectorAll(
      "[data-testid='main-tags-slider-desktop'] a"
    )
  );

  console.log("✅ Found Main Categories:", mainLinks.length);

  // ================================
  // Loop Through Each Main Category
  // ================================
  for (let mainIndex = 0; mainIndex < mainLinks.length; mainIndex++) {
    const mainLink = mainLinks[mainIndex];

    // Decode Main Category Name
    const mainName = decodeURIComponent(mainLink.href.split("/").pop());

    console.log(`\n📌 Opening Main Category: ${mainName}`);

    // Click Main Category
    mainLink.click();

    // Wait for Level 1 Tags to Load
    await sleep(2000);

    // ================================
    // Collect Level 1 Tags
    // ================================
    const level1Links = Array.from(
      document.querySelectorAll("[data-testid='child-tags-level-1'] a")
    );

    console.log(`   ✅ Found Level 1 Tags: ${level1Links.length}`);

    const level1Data = [];

    // ================================
    // Loop Through Each Level 1 Tag
    // ================================
    for (let i = 0; i < level1Links.length; i++) {
      const level1Link = level1Links[i];

      const level1Name = decodeURIComponent(
        level1Link.href.split("/").pop()
      );

      console.log(`   ➝ Level 1: ${level1Name}`);

      // Click Level 1 Tag
      level1Link.click();

      // Wait for Level 2 Tags to Load
      await sleep(1500);

      // ================================
      // Collect Level 2 Tags (Optional)
      // ================================
      const level2Links = Array.from(
        document.querySelectorAll("[data-testid='child-tags-level-2'] a")
      );

      let level2Data = [];

      if (level2Links.length > 0) {
        console.log(
          `      ✅ Found Level 2 Tags: ${level2Links.length}`
        );

        level2Data = level2Links.map((l2) => ({
          haraj_child_tags_level_2: decodeURIComponent(
            l2.href.split("/").pop()
          ),
        }));
      } else {
        console.log("      ⚠️ No Level 2 Tags Found");
      }

      // ================================
      // Push Level 1 Object
      // ================================
      level1Data.push({
        haraj_child_tags_level_1: level1Name,
        children_level_2: level2Data,
      });
    }

    // ================================
    // Push Main Category Object
    // ================================
    result.push({
      haraj_main_category_path: {
        name: mainName,
        children_level_1: level1Data,
      },
    });
  }

  // ================================
  // Print Final JSON in Console
  // ================================
  console.log("\n✅ FINAL JSON RESULT:");
  console.log(JSON.stringify(result, null, 2));

  // ================================
  // Download JSON File Automatically
  // ================================
  console.log("\n📥 Downloading haraj_tags.json ...");

  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: "application/json",
  });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "haraj_tags.json";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  console.log("✅ Download Complete!");

})();
